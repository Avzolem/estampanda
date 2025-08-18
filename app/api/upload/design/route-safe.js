import { NextResponse } from "next/server";
import { getSession } from "@/libs/next-auth-safe";

// Función simplificada para manejar uploads sin depender de Cloudinary
async function handleLocalUpload(file, name) {
  // Crear una URL temporal usando Data URL
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
  
  return {
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

export async function POST(req) {
  try {
    // Intentar obtener sesión de manera segura
    const session = await getSession();
    const userId = session?.user?.id || `guest_${Date.now()}`;

    const formData = await req.formData();
    const file = formData.get("file");
    const name = formData.get("name") || "Untitled Design";

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

    let uploadResult;
    
    // Intentar usar Cloudinary si está configurado
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const { uploadStickerDesign } = await import("@/libs/cloudinary");
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        
        uploadResult = await uploadStickerDesign(base64, userId, name);
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed, using local fallback:", cloudinaryError);
        uploadResult = await handleLocalUpload(file, name);
      }
    } else {
      // Si Cloudinary no está configurado, usar fallback local
      uploadResult = await handleLocalUpload(file, name);
    }

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || "Upload failed" },
        { status: 500 }
      );
    }

    // Crear ID temporal para el diseño
    let designId = `temp_${Date.now()}`;
    
    // Si hay MongoDB configurado y usuario autenticado, guardar en DB
    if (session?.user?.id && process.env.MONGODB_URI) {
      try {
        const connectMongo = (await import("@/libs/mongoose")).default;
        const Design = (await import("@/models/Design")).default;
        
        await connectMongo();
        
        const design = await Design.create({
          userId: session.user.id,
          name,
          originalFileUrl: uploadResult.data.originalUrl,
          processedFileUrl: uploadResult.data.processedUrl,
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
          tags: [],
          category: "other",
        });
        
        designId = design._id;
      } catch (dbError) {
        console.error("Database save failed:", dbError);
        // Continuar sin guardar en DB
      }
    }

    return NextResponse.json({
      success: true,
      design: {
        id: designId,
        name: name,
        thumbnailUrl: uploadResult.data.thumbnailUrl,
        processedFileUrl: uploadResult.data.processedUrl,
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
      // Devolver array vacío si no hay autenticación
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

    // Solo intentar acceder a DB si está configurada
    if (!process.env.MONGODB_URI) {
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

    const connectMongo = (await import("@/libs/mongoose")).default;
    const Design = (await import("@/models/Design")).default;
    
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
    // Devolver respuesta vacía en lugar de error
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
}