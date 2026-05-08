/**
 * Wrapper lazy de @imgly/background-removal.
 * El módulo NO se importa hasta que se llama loadModule().
 */

let removeBackgroundFn = null;

async function loadModule() {
  if (!removeBackgroundFn) {
    const mod = await import("@imgly/background-removal");
    removeBackgroundFn = mod.removeBackground;
  }
  return removeBackgroundFn;
}

/**
 * Quita el fondo de una imagen y devuelve un Blob PNG con transparencia.
 * @param {string} imageUrl
 * @param {(key:string, percent:number) => void} [onProgress]
 * @returns {Promise<Blob>}
 */
export async function removeBackgroundFromUrl(imageUrl, onProgress) {
  const removeBackground = await loadModule();
  const blob = await removeBackground(imageUrl, {
    progress: (key, current, total) => {
      const pct = total ? Math.round((current / total) * 100) : 0;
      onProgress?.(key, pct);
    },
    output: { format: "image/png", quality: 0.95 },
    model: "medium",
  });
  return blob;
}

export function isBackgroundRemovalSupported() {
  if (typeof WebAssembly !== "object") return false;
  try {
    // SIMD support check (mini wasm con SIMD)
    return WebAssembly.validate(new Uint8Array([
      0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11
    ]));
  } catch {
    return false;
  }
}
