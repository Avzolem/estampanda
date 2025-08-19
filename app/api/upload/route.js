import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";

// Configuración de Cloudinary (cuando esté listo)
const uploadToCloudinary = async (base64Image) => {
  // Si Cloudinary está configurado
  if (process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET) {
    
    const cloudinary = require('cloudinary').v2;
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'estampanda/designs',
        resource_type: 'auto',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto:best' }
        ]
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  }
  
  // Fallback: Retornar la imagen en base64
  return {
    url: base64Image,
    publicId: `local_${Date.now()}`,
    width: 500,
    height: 500,
  };
};

// POST /api/upload
export async function POST(req) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { image, type = 'design' } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Validar tamaño de imagen (max 10MB)
    const sizeInBytes = image.length * 0.75; // Aproximación para base64
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 10) {
      return NextResponse.json(
        { error: "Image size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Subir imagen
    const uploadResult = await uploadToCloudinary(image);

    // Guardar referencia en base de datos si es necesario
    if (type === 'design') {
      await connectMongo();
      
      // Aquí podrías guardar la referencia del diseño en una colección
      // Por ejemplo:
      // const design = await Design.create({
      //   userId: session.user.id,
      //   imageUrl: uploadResult.url,
      //   publicId: uploadResult.publicId,
      //   dimensions: { width: uploadResult.width, height: uploadResult.height }
      // });
    }

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        dimensions: {
          width: uploadResult.width,
          height: uploadResult.height
        }
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to upload image",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/upload
export async function DELETE(req) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: "No publicId provided" },
        { status: 400 }
      );
    }

    // Si Cloudinary está configurado, eliminar de Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudinary = require('cloudinary').v2;
      
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      await cloudinary.uploader.destroy(publicId);
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete image" 
      },
      { status: 500 }
    );
  }
}