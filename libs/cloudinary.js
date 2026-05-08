import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadStickerDesign = async (file, userId, designName) => {
  try {
    const timestamp = Date.now();
    const folder = `estampanda/users/${userId}/designs`;
    
    const uploadOptions = {
      folder,
      public_id: `${designName.replace(/\s+/g, "_")}_${timestamp}`,
      overwrite: false,
      resource_type: "image",
      type: "upload",
      allowed_formats: ["jpg", "jpeg", "png", "svg", "webp", "ai", "pdf", "eps"],
      transformation: [
        { quality: "auto:best" },
        { fetch_format: "auto" },
      ],
      context: {
        alt: designName,
        caption: `Sticker design: ${designName}`,
        user_id: userId,
      },
      tags: ["sticker", "design", "user-upload"],
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    const processedUrl = cloudinary.url(result.public_id, {
      transformation: [
        { quality: "auto:best" },
        { fetch_format: "auto" },
        { dpr: "auto" },
      ],
    });

    const thumbnailUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 300, height: 300, crop: "fit", background: "transparent" },
        { quality: "auto:good" },
        { format: "webp" },
      ],
    });

    const previewUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 800, height: 800, crop: "fit", background: "transparent" },
        { quality: "auto:best" },
        { format: "png" },
      ],
    });

    return {
      success: true,
      data: {
        originalUrl: result.secure_url,
        processedUrl,
        thumbnailUrl,
        previewUrl,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        colors: result.colors || [],
        isTransparent: result.format === "png" || result.format === "svg",
      },
    };
  } catch (error) {
    console.error("Sticker design upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const removeBackground = async (publicId) => {
  try {
    const result = cloudinary.url(publicId, {
      transformation: [
        { effect: "background_removal" },
        { quality: "auto:best" },
        { format: "png" },
      ],
    });

    return {
      success: true,
      url: result,
    };
  } catch (error) {
    console.error("Background removal error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === "ok",
      result,
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default cloudinary;