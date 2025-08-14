import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { uploadStickerDesign, removeBackground } from "@/libs/cloudinary";
import connectMongo from "@/libs/mongoose";
import Design from "@/models/Design";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

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

    const uploadResult = await uploadStickerDesign(
      base64,
      session.user.id,
      name
    );

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

    return NextResponse.json({
      success: true,
      design: {
        id: design._id,
        name: design.name,
        thumbnailUrl: design.thumbnailUrl,
        processedFileUrl: design.processedFileUrl,
        originalFileUrl: design.originalFileUrl,
        previewUrl: uploadResult.data.previewUrl,
        dimensions: design.dimensions,
        hasTransparency: design.hasTransparency,
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
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