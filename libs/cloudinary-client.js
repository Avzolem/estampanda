/**
 * Helpers cliente para upload directo a Cloudinary con firma del server.
 * Browser → Cloudinary directo (no pasa por nuestro server).
 */

/**
 * Sube un File a Cloudinary y registra el Design en MongoDB.
 * @param {File} file
 * @param {(percent:number) => void} [onProgress]
 * @returns {Promise<Design>}
 */
export async function uploadDesignToCloudinary(file, onProgress) {
  // 1. Pedir firma al server
  const sigRes = await fetch("/api/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
    }),
  });
  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => ({}));
    throw new Error(err.error || "No se pudo obtener firma de upload");
  }
  const { signature, timestamp, apiKey, cloudName, folder, publicId, eager } = await sigRes.json();

  // 2. Upload directo a Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("eager", eager);

  const cdResult = await uploadWithProgress(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    formData,
    onProgress
  );

  // 3. Notificar al server
  const designRes = await fetch("/api/designs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cloudinaryPublicId: cdResult.public_id,
      originalFileUrl: cdResult.secure_url,
      thumbnailUrl: cdResult.eager?.[0]?.secure_url,
      previewUrl: cdResult.eager?.[1]?.secure_url,
      width: cdResult.width,
      height: cdResult.height,
      fileType: cdResult.format,
      fileSize: cdResult.bytes,
      hasTransparency: ["png", "svg", "webp"].includes(cdResult.format),
      name: file.name.split(".").slice(0, -1).join(".") || file.name,
    }),
  });
  if (!designRes.ok) {
    const err = await designRes.json().catch(() => ({}));
    throw new Error(err.error || "No se pudo registrar el diseño");
  }
  const { design } = await designRes.json();
  return design;
}

/**
 * Sube un Blob procesado (post bg-removal) a Cloudinary.
 * Devuelve {publicId, url}.
 */
export async function uploadProcessedToCloudinary(blob, originalDesignName) {
  const file = new File([blob], `${originalDesignName}_nobg.png`, { type: "image/png" });

  const sigRes = await fetch("/api/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
    }),
  });
  if (!sigRes.ok) throw new Error("Signature failed");
  const { signature, timestamp, apiKey, cloudName, folder, publicId, eager } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("eager", eager);

  const result = await uploadWithProgress(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    formData,
    null
  );

  return { publicId: result.public_id, url: result.secure_url };
}

function uploadWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(new Error("Invalid JSON from Cloudinary"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.open("POST", url);
    xhr.send(formData);
  });
}
