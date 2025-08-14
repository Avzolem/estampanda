import { v2 as cloudinary } from 'cloudinary';
import config from '@/config';

// Configurar Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Valida un archivo de imagen antes de subirlo
 * @param {File} file - Archivo a validar
 * @returns {Object} Resultado de la validación
 */
export function validateImageFile(file) {
  const { fileRequirements } = config.stickers;
  
  // Validar tipo de archivo
  const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
  if (!fileRequirements.acceptedFormats.includes(fileExtension)) {
    return {
      valid: false,
      error: `Formato no soportado. Formatos aceptados: ${fileRequirements.acceptedFormats.join(', ')}`,
    };
  }
  
  // Validar tamaño del archivo
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > fileRequirements.maxFileSize) {
    return {
      valid: false,
      error: `El archivo es muy grande. Tamaño máximo: ${fileRequirements.maxFileSize}MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Sube una imagen a Cloudinary
 * @param {string} fileBase64 - Archivo en base64
 * @param {Object} options - Opciones de subida
 * @returns {Promise<Object>} Información de la imagen subida
 */
export async function uploadToCloudinary(fileBase64, options = {}) {
  try {
    const uploadOptions = {
      folder: 'estampanda/designs',
      resource_type: 'auto',
      quality: 'auto:best',
      fetch_format: 'auto',
      ...options,
    };
    
    const result = await cloudinary.uploader.upload(fileBase64, uploadOptions);
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      thumbnailUrl: cloudinary.url(result.public_id, {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
      }),
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Genera variaciones de una imagen para diferentes usos
 * @param {string} publicId - ID público de Cloudinary
 * @returns {Object} URLs de las variaciones
 */
export function generateImageVariations(publicId) {
  if (!publicId) return null;
  
  return {
    original: cloudinary.url(publicId, { quality: 'auto:best' }),
    thumbnail: cloudinary.url(publicId, {
      width: 150,
      height: 150,
      crop: 'fill',
      quality: 'auto',
    }),
    preview: cloudinary.url(publicId, {
      width: 500,
      height: 500,
      crop: 'fit',
      quality: 'auto:good',
    }),
    highRes: cloudinary.url(publicId, {
      width: 1200,
      height: 1200,
      crop: 'fit',
      quality: 'auto:best',
    }),
    mockup: cloudinary.url(publicId, {
      width: 800,
      height: 800,
      crop: 'pad',
      background: 'white',
      quality: 'auto:good',
    }),
  };
}

/**
 * Aplica efectos a una imagen para preview de material
 * @param {string} publicId - ID público de Cloudinary
 * @param {string} material - Tipo de material
 * @returns {string} URL de la imagen con efectos
 */
export function applyMaterialEffect(publicId, material) {
  if (!publicId) return null;
  
  const effects = {
    matte: {
      effect: 'art:athena',
      quality: 'auto:good',
    },
    glossy: {
      effect: 'sharpen:100',
      quality: 'auto:best',
      contrast: 20,
    },
    transparent: {
      background: 'transparent',
      opacity: 90,
    },
    holographic: {
      effect: 'art:zorro',
      contrast: 30,
      saturation: 150,
    },
    'glow-in-dark': {
      effect: 'negate',
      gamma: 150,
    },
    metallic: {
      effect: 'gradient_fade',
      saturation: -50,
      contrast: 50,
    },
  };
  
  const materialEffect = effects[material] || {};
  
  return cloudinary.url(publicId, {
    width: 500,
    height: 500,
    crop: 'fit',
    ...materialEffect,
  });
}

/**
 * Genera un mockup del sticker en un producto
 * @param {string} publicId - ID público del diseño
 * @param {string} mockupType - Tipo de mockup (laptop, bottle, etc)
 * @returns {string} URL del mockup
 */
export function generateMockup(publicId, mockupType = 'laptop') {
  if (!publicId) return null;
  
  const mockupTemplates = {
    laptop: {
      overlay: 'estampanda/mockups/laptop_template',
      width: 800,
      height: 600,
      x: 400,
      y: 300,
      angle: 0,
    },
    bottle: {
      overlay: 'estampanda/mockups/bottle_template',
      width: 600,
      height: 800,
      x: 300,
      y: 400,
      angle: 0,
    },
    skateboard: {
      overlay: 'estampanda/mockups/skateboard_template',
      width: 400,
      height: 1200,
      x: 200,
      y: 600,
      angle: 0,
    },
    phone: {
      overlay: 'estampanda/mockups/phone_template',
      width: 400,
      height: 800,
      x: 200,
      y: 400,
      angle: 0,
    },
  };
  
  const template = mockupTemplates[mockupType] || mockupTemplates.laptop;
  
  // Generar URL con overlay del mockup
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: 200,
        height: 200,
        crop: 'fill',
      },
      {
        overlay: template.overlay,
        width: template.width,
        height: template.height,
        x: template.x,
        y: template.y,
        angle: template.angle,
        flags: 'layer_apply',
      },
    ],
  });
}

/**
 * Extrae los colores dominantes de una imagen
 * @param {string} publicId - ID público de Cloudinary
 * @returns {Promise<Array>} Array de colores dominantes
 */
export async function extractDominantColors(publicId) {
  try {
    // Cloudinary puede extraer colores dominantes
    const result = await cloudinary.api.resource(publicId, {
      colors: true,
    });
    
    if (result.colors) {
      return result.colors.map(([color, percentage]) => ({
        hex: color,
        percentage: Math.round(percentage * 100) / 100,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error extracting colors:', error);
    return [];
  }
}

/**
 * Optimiza una imagen para web
 * @param {string} publicId - ID público de Cloudinary
 * @returns {Object} URLs optimizadas
 */
export function optimizeForWeb(publicId) {
  if (!publicId) return null;
  
  return {
    webp: cloudinary.url(publicId, {
      fetch_format: 'webp',
      quality: 'auto',
      flags: 'progressive',
    }),
    jpg: cloudinary.url(publicId, {
      fetch_format: 'jpg',
      quality: 'auto:good',
      flags: 'progressive',
    }),
    responsive: [
      { width: 320, url: cloudinary.url(publicId, { width: 320, quality: 'auto' }) },
      { width: 640, url: cloudinary.url(publicId, { width: 640, quality: 'auto' }) },
      { width: 1024, url: cloudinary.url(publicId, { width: 1024, quality: 'auto' }) },
      { width: 1920, url: cloudinary.url(publicId, { width: 1920, quality: 'auto' }) },
    ],
  };
}

/**
 * Elimina el fondo de una imagen (requiere Remove.bg API o Cloudinary AI)
 * @param {string} publicId - ID público de Cloudinary
 * @returns {Promise<string>} URL de la imagen sin fondo
 */
export async function removeBackground(publicId) {
  try {
    // Opción 1: Usar Cloudinary AI Background Removal (requiere addon)
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      background_removal: 'cloudinary_ai',
    });
    
    return result.secure_url;
  } catch (error) {
    // Opción 2: Usar Remove.bg API si está configurada
    if (process.env.REMOVE_BG_API_KEY) {
      // Implementar integración con Remove.bg
      console.log('Remove.bg integration pending');
    }
    
    console.error('Error removing background:', error);
    return null;
  }
}

/**
 * Valida las dimensiones y DPI de una imagen
 * @param {Object} imageData - Datos de la imagen
 * @returns {Object} Resultado de la validación
 */
export function validateImageQuality(imageData) {
  const { width, height, dpi = 72 } = imageData;
  const { fileRequirements } = config.stickers;
  
  const warnings = [];
  const errors = [];
  
  // Validar DPI
  if (dpi < fileRequirements.minDPI) {
    warnings.push(
      `La resolución (${dpi} DPI) es menor a la recomendada (${fileRequirements.minDPI} DPI). ` +
      `La imagen podría verse pixelada al imprimir.`
    );
  }
  
  // Validar dimensiones mínimas para impresión
  const minPixelsFor10cm = 1181; // 10cm a 300 DPI
  if (width < minPixelsFor10cm || height < minPixelsFor10cm) {
    warnings.push(
      `La imagen es muy pequeña para imprimir en tamaños grandes. ` +
      `Dimensiones actuales: ${width}x${height}px`
    );
  }
  
  // Validar relación de aspecto extrema
  const aspectRatio = width / height;
  if (aspectRatio > 3 || aspectRatio < 0.33) {
    warnings.push(
      `La relación de aspecto es muy extrema, ` +
      `esto podría resultar en recortes no deseados.`
    );
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    quality: {
      dpi,
      width,
      height,
      aspectRatio: Math.round(aspectRatio * 100) / 100,
      recommendedMaxSize: Math.min(
        Math.floor(width / 118.11), // píxeles a cm a 300 DPI
        Math.floor(height / 118.11),
        20 // máximo 20cm
      ),
    },
  };
}

export default {
  validateImageFile,
  uploadToCloudinary,
  generateImageVariations,
  applyMaterialEffect,
  generateMockup,
  extractDominantColors,
  optimizeForWeb,
  removeBackground,
  validateImageQuality,
};