import { NextResponse } from "next/server";
import { uploadStickerDesign, removeBackground } from "@/libs/cloudinary";
import connectMongo from "@/libs/mongoose";
import Design from "@/models/Design";

// Safe session helper
async function getSession() {
  try {
    const { auth } = await import("@/libs/next-auth");
    return await auth();
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    // Allow both authenticated and guest uploads
    const userId = session?.user?.id || `guest_${Date.now()}`;

    const formData = await req.formData();
    const file = formData.get("file");
    const name = formData.get("name") || "Untitled Design";
    const category = formData.get("category") || "other";
    const tags = formData.get("tags")?.split(",") || [];
    const removeBackgroundOption = formData.get("removeBackground") === "true";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Accepted: JPG, PNG, SVG, WebP" },
        { status: 400 }
      );
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 50MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    let uploadResult;
    
    // Try to use Cloudinary if configured
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        uploadResult = await uploadStickerDesign(base64, userId, name);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);
        // Fallback to local storage
        uploadResult = {
          success: true,
          data: {
            originalUrl: base64,
            processedUrl: base64,
            thumbnailUrl: base64,
            previewUrl: base64,
            publicId: `local_${Date.now()}`,
            width: 800,
            height: 800,
            format: file.type.split("/")[1],
            size: file.size,
            colors: [],
            isTransparent: file.type.includes("png"),
          },
        };
      }
    } else {
      // Use local storage if Cloudinary not configured
      uploadResult = {
        success: true,
        data: {
          originalUrl: base64,
          processedUrl: base64,
          thumbnailUrl: base64,
          previewUrl: base64,
          publicId: `local_${Date.now()}`,
          width: 800,
          height: 800,
          format: file.type.split("/")[1],
          size: file.size,
          colors: [],
          isTransparent: file.type.includes("png"),
        },
      };
    }

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || "Upload failed" },
        { status: 500 }
      );
    }

    let processedFileUrl = uploadResult.data.processedUrl;
    
    if (removeBackgroundOption) {
      const bgRemovalResult = await removeBackground(uploadResult.data.publicId);
      if (bgRemovalResult.success) {
        processedFileUrl = bgRemovalResult.url;
      }
    }

    // Only save to database if user is authenticated
    let designId = `temp_${Date.now()}`;
    
    if (session?.user?.id) {
      await connectMongo();

      const design = await Design.create({
        userId: session.user.id,
        name,
        originalFileUrl: uploadResult.data.originalUrl,
        processedFileUrl,
        thumbnailUrl: uploadResult.data.thumbnailUrl,
        fileType: file.type.split("/")[1],
        fileSize: uploadResult.data.size,
        dimensions: {
          width: uploadResult.data.width,
          height: uploadResult.data.height,
          unit: "px",
          dpi: 300,
        },
        hasTransparency: uploadResult.data.isTransparent,
        colors: uploadResult.data.colors,
        tags,
        category,
        processingStatus: {
          backgroundRemoved: removeBackgroundOption,
          vectorized: false,
          optimized: true,
        },
        metadata: {
          dateCreated: new Date(),
        },
      });
      
      designId = design._id;
    }

    return NextResponse.json({
      success: true,
      design: {
        id: designId,
        name: name,
        thumbnailUrl: uploadResult.data.thumbnailUrl,
        processedFileUrl: processedFileUrl,
        originalFileUrl: uploadResult.data.originalUrl,
        previewUrl: uploadResult.data.previewUrl,
        dimensions: {
          width: uploadResult.data.width,
          height: uploadResult.data.height,
          unit: "px",
          dpi: 300,
        },
        hasTransparency: uploadResult.data.isTransparent,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      // Return empty array for unauthenticated users
      return NextResponse.json({
        success: true,
        designs: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0,
        },
      });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "active";

    await connectMongo();

    const query = {
      userId: session.user.id,
      status,
    };

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const designs = await Design.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("-__v");

    const total = await Design.countDocuments(query);

    return NextResponse.json({
      success: true,
      designs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch designs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch designs" },
      { status: 500 }
    );
  }
}