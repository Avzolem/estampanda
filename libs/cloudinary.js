import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: "estampanda/designs",
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "svg", "webp", "gif"],
      transformation: [
        { quality: "auto:best" },
        { fetch_format: "auto" },
      ],
      ...options,
    };

    const result = await cloudinary.uploader.upload(file, defaultOptions);

    return {
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
        thumbnailUrl: cloudinary.url(result.public_id, {
          width: 200,
          height: 200,
          crop: "fill",
          quality: "auto",
          format: "webp",
        }),
      },
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

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

export const applyMockup = async (publicId, mockupType = "sticker") => {
  const mockups = {
    sticker: {
      overlay: "estampanda/mockups/sticker_template",
      gravity: "center",
      width: 500,
      height: 500,
      crop: "fit",
    },
    laptop: {
      overlay: "estampanda/mockups/laptop_template",
      gravity: "center",
      width: 300,
      height: 300,
      crop: "fit",
      angle: -5,
    },
    bottle: {
      overlay: "estampanda/mockups/bottle_template",
      gravity: "center",
      width: 250,
      height: 400,
      crop: "fit",
    },
  };

  try {
    const mockup = mockups[mockupType] || mockups.sticker;
    
    const mockupUrl = cloudinary.url(publicId, {
      transformation: [
        {
          width: mockup.width,
          height: mockup.height,
          crop: mockup.crop,
          gravity: mockup.gravity,
        },
        {
          overlay: mockup.overlay,
          gravity: "center",
          flags: "relative",
          width: 1.0,
          height: 1.0,
        },
        { quality: "auto:best" },
        { format: "jpg" },
      ],
    });

    return {
      success: true,
      url: mockupUrl,
      type: mockupType,
    };
  } catch (error) {
    console.error("Mockup generation error:", error);
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

export const optimizeForPrint = async (publicId, dimensions) => {
  try {
    const { width, height, dpi = 300 } = dimensions;
    
    const printWidth = Math.round((width / 2.54) * dpi);
    const printHeight = Math.round((height / 2.54) * dpi);

    const printReadyUrl = cloudinary.url(publicId, {
      transformation: [
        {
          width: printWidth,
          height: printHeight,
          crop: "fit",
          background: "transparent",
        },
        { dpr: 1.0 },
        { quality: 100 },
        { format: "png" },
        { flags: "attachment" },
      ],
    });

    return {
      success: true,
      url: printReadyUrl,
      dimensions: {
        width: printWidth,
        height: printHeight,
        dpi,
      },
    };
  } catch (error) {
    console.error("Print optimization error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const generateStickerSheet = async (publicIds, sheetSize = "A4") => {
  const sheets = {
    A4: { width: 2480, height: 3508 },
    Letter: { width: 2550, height: 3300 },
  };

  try {
    const sheet = sheets[sheetSize] || sheets.A4;
    const padding = 50;
    const stickerSize = 300;
    const cols = Math.floor((sheet.width - padding * 2) / (stickerSize + padding));
    const rows = Math.floor((sheet.height - padding * 2) / (stickerSize + padding));

    const transformations = [
      { width: sheet.width, height: sheet.height, crop: "fill", background: "white" },
    ];

    publicIds.slice(0, cols * rows).forEach((publicId, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = padding + col * (stickerSize + padding);
      const y = padding + row * (stickerSize + padding);

      transformations.push({
        overlay: publicId,
        width: stickerSize,
        height: stickerSize,
        crop: "fit",
        gravity: "north_west",
        x,
        y,
      });
    });

    transformations.push(
      { quality: "auto:best" },
      { format: "pdf" }
    );

    const sheetUrl = cloudinary.url("estampanda/sheets/blank", {
      transformation: transformations,
    });

    return {
      success: true,
      url: sheetUrl,
      layout: {
        sheetSize,
        stickerCount: Math.min(publicIds.length, cols * rows),
        cols,
        rows,
      },
    };
  } catch (error) {
    console.error("Sticker sheet generation error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default cloudinary;