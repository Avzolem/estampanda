---
date: 2026-05-08
status: aprobado por el equipo (pending implementation)
sub-proyecto: 1 de N (decomposición del proyecto Estampanda)
sucesor: sub-proyecto #2 (Stripe checkout end-to-end)
title: Upload de diseños + Carrito anónimo persistente
---

# Sub-proyecto #1 — Upload de diseños + Carrito anónimo persistente

## Resumen ejecutivo

Este sub-proyecto entrega la primera mitad del flujo de compra de Estampanda: **el cliente anónimo puede subir múltiples diseños, configurar cada uno (material/tamaño/corte/cantidad), mantener un carrito persistente, y editar items en cualquier momento**. El checkout y pago con Stripe se cubrirán en el sub-proyecto #2.

El estado actual del proyecto tiene una integración de Cloudinary parcial (no es mock como decía STATUS.md, pero tiene tres problemas fatales: no soporta clientes anónimos en MongoDB, no soporta archivos > ~3 MB en Vercel, y carece de modelo de carrito). Este sub-proyecto resuelve esos problemas con: signed direct upload (browser → Cloudinary), sesión anónima por cookie, modelo `Cart` nuevo, refactor del modelo `Design` para soportar guests, y un cron diario de limpieza.

Adicionalmente integra **background removal en el navegador** con `@imgly/background-removal-js` (modelo open-source, costo cero por imagen, sin lock-in) reemplazando la dependencia hipotética en Cloudinary AI o remove.bg.

**Estimado:** 6-10 días de trabajo, divididos en 5 fases verificables.

---

## Contexto: decisiones tomadas durante brainstorming

| # | Decisión | Por qué |
|---|---|---|
| 1 | **Cloudinary** (no migrar a Vercel Blob) | Las transformaciones URL-based son críticas para el caso de uso; SDK ya integrado a medias; free tier (25 GB) holgado para MVP. |
| 2 | **Carrito multi-diseño anónimo** (no one-shot, no cuenta de cliente) | Mejor balance UX/complejidad para MVP. Permite venta sin login. |
| 3 | **Alcance "MVP+ con preview real"** (opción B) | Cliente compra con confianza; agrega DPI inteligente y preview con corte aplicado; defer mockups visuales y biblioteca pre-hecha. |
| 4 | **TTL del carrito: 24 horas** sin actividad | Cleanup agresivo, mínimo costo en Cloudinary. |
| 5 | **DPI bajo: avisar y dejar continuar** | Menor fricción; cliente decide; se guarda flag `dpiWarning` para auditoría. |
| 6 | **Items editables y reusables** | Cliente puede editar config de un item ya añadido; mismo `Design` puede aparecer en múltiples items con configs distintas. |
| 7 | **Formatos: bitmaps + SVG** (JPG, PNG, WebP, SVG) | Cubre ~95 % de casos. PDF y formatos Adobe defer a fase 2 por complejidad de preview. |
| 8 | **Background removal en browser** con `@imgly/background-removal-js` | Costo cero, privacidad real, sin lock-in. Trade-off: descarga inicial 80 MB, 5-30 s por imagen. |

---

## 1. Arquitectura y flujo de usuario

### 1.1 Flujo del cliente (golden path)

```
1. Cliente entra a /stickers (sin login)
   → middleware crea cookie cart-session-id (UUID, httpOnly, 30 días)

2. Cliente sube diseño 1
   → Browser pide signed upload signature al server
   → Browser sube directo a Cloudinary (NO pasa por nuestro server)
   → Server crea Design en MongoDB con sessionId, expiresAt = now + 24h
   → Cliente ve preview con DPI calculado y corte aplicado

3. Cliente configura material/tamaño/corte/cantidad
   → DPI se recalcula en vivo según tamaño elegido
   → Si DPI < 300: warning visible (verde/amarillo/rojo)
   → Cliente añade al carrito → POST /api/cart/items
   → Server calcula unitPrice y persiste con snapshot de multipliers

4. Cliente repite paso 2-3 con N diseños distintos
   → Carrito acumula items
   → Cookie sessionId mantiene asociación
   → Mismo Design puede tener varios items con configs distintas

5. Cliente cierra browser y vuelve al día siguiente
   → Si pasaron < 24h desde última actividad: carrito completo
   → Si pasaron > 24h: carrito vacío, diseños borrados de Cloudinary

6. Cliente hace click en "Quitar fondo" en algún diseño (opcional)
   → 1ª vez: descarga modelo @imgly (~80 MB) con animación
   → Procesa imagen en cliente (5-30 s)
   → Resultado se sube a Cloudinary como versión processed
   → Preview cambia a versión sin fondo (con botón "Volver al original")

7. Cliente hace checkout → handover al sub-proyecto #2 (Stripe)
```

### 1.2 Componentes del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │FileUploader │→ │@imgly/bg-rm  │  │  Cart UI         │    │
│  └──────┬──────┘  └──────────────┘  └────────┬─────────┘    │
│         │                                     │              │
└─────────┼─────────────────────────────────────┼──────────────┘
          │                                     │
          │ 1. POST /api/upload/signature       │ POST /api/cart/items
          │ ←─ {signature, timestamp, folder}   │
          │                                     │
          │ 2. Direct upload to Cloudinary      │
          │ ←─ {publicId, secureUrl, w, h}      │
          │                                     │
          │ 3. POST /api/designs (notify)       │
          │ ←─ {designId, dpi, dimensions}      │
          │                                     │
┌─────────▼─────────────────────────────────────▼──────────────┐
│                    NEXT.JS SERVER                             │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │ Signed Upload   │  │ /api/designs │  │ /api/cart/*    │   │
│  │ Signature gen   │  │ POST GET DEL │  │ GET POST PATCH │   │
│  └─────────────────┘  └──────┬───────┘  └────────┬───────┘   │
│                              │                    │           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Cookie session middleware                  │  │
│  │           (cart-session-id, httpOnly, 30d)              │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────┬───────────────────────┬─────────────────────────┘
               │                        │
        ┌──────▼──────┐         ┌──────▼──────┐
        │  MongoDB    │         │ Cloudinary  │
        │  Design     │         │  storage    │
        │  Cart       │         │             │
        └─────────────┘         └─────────────┘
                ▲
                │ daily cron 03:00 UTC
        ┌───────┴────────┐
        │ Cleanup job    │
        │ (Vercel cron)  │
        │ delete > 24h   │
        └────────────────┘
```

### 1.3 Decisiones arquitectónicas clave

1. **Direct signed upload**: el browser sube directo a Cloudinary; nuestro server solo firma. Evita el límite de 4.5 MB de Vercel y libera recursos del server.
2. **Cookie `cart-session-id` httpOnly**: generada por middleware. Vive 30 días en browser pero el carrito en sí expira a 24 h sin actividad.
3. **`Design` y `Cart` viven en MongoDB con `sessionId`**: guests son ciudadanos de primera clase del modelo, no un hack.
4. **Background removal en browser**: usa `@imgly/background-removal-js`, lazy load del modelo solo al click.
5. **Cron diario** de limpieza con Vercel Cron + endpoint protegido por `CRON_SECRET`.
6. **`Order` se refactoriza en sub-proyecto #2** — explícitamente fuera del scope de este. El checkout consumirá `Cart` y creará `Order` ahí.

---

## 2. Modelo de datos

### 2.1 Refactor del modelo `Design`

**Quitar campos heredados de la plantilla:**
- `userId.required: true` → `userId` opcional
- `isPublic`, `isTemplate`, `usageCount`, `likes` (sistema social no aplica)
- `aiGenerated`, `aiPrompt` (no hay generación por IA)
- `metadata.software/camera/location` (EXIF no se usa)
- `processingStatus.vectorized` (no vectorizamos)
- `incrementUsage()` method (sin sistema de reuso público)
- `category` enum: simplificar valores o eliminar (no se usa hoy)

**Añadir:**
- `sessionId: String, index: true` — para guests
- `cloudinaryPublicId: String, required` — explícito
- `cloudinaryProcessedPublicId: String` — para versión post-bg-removal
- `cloudinaryFolder: String` — `temp/{sessionId}` o `users/{userId}`
- `previewUrl: String` — versión 800×800 con transparencia (de eager transformations)
- `expiresAt: Date, index: true` — null si vinculado a Order pagada

**Schema final:**

```javascript
// models/Design.js
{
  // Identidad: uno de los dos requerido (validado en pre-save)
  userId: ObjectId, ref: 'User',           // null para guests
  sessionId: String, index: true,           // null para usuarios autenticados

  name: String,                             // generado del filename si no viene

  // Cloudinary
  cloudinaryPublicId: String, required,     // ej. "estampanda/temp/abc-123/diseno_1234"
  cloudinaryProcessedPublicId: String,      // ej. "estampanda/temp/abc-123/diseno_1234_nobg"
  cloudinaryFolder: String,
  originalFileUrl: String, required,        // secure_url
  thumbnailUrl: String,                     // 300x300 webp (eager)
  previewUrl: String,                       // 800x800 png con transparencia (eager)
  processedFileUrl: String,                 // post background-removal

  // Metadata de archivo
  fileType: String, enum: ['jpg','png','svg','webp'], required,
  fileSize: Number, required,               // bytes
  dimensions: {
    width: Number, required,                // px
    height: Number, required,               // px
  },
  hasTransparency: Boolean,                 // detectado al subir

  // Estado
  status: String, enum: ['active','deleted'], default: 'active',
  processingStatus: {
    backgroundRemoved: Boolean, default: false,
    optimized: Boolean, default: true,
  },

  // Lifecycle
  expiresAt: Date, index: true,             // null = no expira (vinculado a Order pagada)

  // timestamps automáticos: createdAt, updatedAt
}
```

**Validación pre-save:** `userId` o `sessionId` debe existir, no ambos null.

**Índices:**
- `{ sessionId: 1, status: 1 }` — buscar diseños de una sesión
- `{ userId: 1, status: 1 }` — buscar diseños de un user (futuro)
- `{ expiresAt: 1 }` — para el cron de limpieza

**No** se usa TTL index automático de MongoDB. Razón: si Mongo borra el doc primero, perdemos `cloudinaryPublicId` y no podemos limpiar Cloudinary. El cron diario maneja ambos.

### 2.2 Modelo `Cart` (nuevo)

```javascript
// models/Cart.js
{
  sessionId: String, required, unique, index,    // 1 carrito por sesión
  userId: ObjectId, ref: 'User',                 // null hoy

  items: [CartItemSchema],                       // subdocumentos embebidos

  // Lifecycle
  expiresAt: Date, required, index,              // updatedAt + 24h, recalculado en cada cambio

  // timestamps: createdAt, updatedAt
}
```

### 2.3 Subdocumento `CartItem` (embebido en `Cart.items`)

```javascript
{
  _id: ObjectId,                                 // auto, usado para edit/delete específico
  designId: ObjectId, ref: 'Design', required,

  // Snapshot de configuración (mutable)
  material: {
    id: String, required,                        // "matte"
    name: String,                                // "Mate"
    priceMultiplier: Number,                     // snapshot al añadir/editar
  },
  size: {
    width: Number, required,                     // cm
    height: Number, required,                    // cm
    label: String,                               // "Estándar" o "Personalizado"
    custom: Boolean,
  },
  cutType: {
    id: String, required,                        // "diecut"
    name: String,
    priceMultiplier: Number,
  },
  quantity: Number, required, min: 1,

  // Precio (calculado y persistido al añadir/editar)
  unitPrice: Number, required,                   // ya con multipliers aplicados
  totalPrice: Number, required,                  // unitPrice × quantity

  // DPI
  dpi: Number,                                   // snapshot al momento de añadir
  dpiWarning: Boolean,                           // true si dpi < 300 al añadir

  addedAt: Date, default: Date.now,
  updatedAt: Date,
}
```

### 2.4 Decisiones explicadas

1. **Subdocumentos vs colección separada para `CartItem`**: subdocumentos. Atomic updates en una operación, query del carrito = 1 read. Trade-off (16 MB max doc) irrelevante (1000+ items).
2. **Snapshot de `material/cutType`**: si cambias precios de materiales en el futuro, los carritos existentes mantienen el precio que vio el cliente.
3. **`expiresAt` recalculado en cada edición (touch)**: cliente activo no pierde su carrito.
4. **Mismo `designId` puede aparecer en múltiples items**: sin constraint unique. Permite "100 stickers de 5 cm + 50 del mismo a 10 cm".
5. **`Order` queda intacto**: refactor del Order es del sub-proyecto #2.

### 2.5 Migración del Design existente

Se asume **no hay clientes reales aún** (estamos en MVP). Refactor destructivo sin migración. Si hay docs de prueba: `db.designs.deleteMany({})` antes de aplicar el nuevo schema.

---

## 3. Endpoints API

### 3.1 Session middleware

**Archivo:** `middleware.js` (extender el existente que ya protege `/admin/*`)

```javascript
// Antes de cualquier request a /stickers, /cart, /api/cart, /api/designs, /api/upload
// asegurar cookie 'cart-session-id'
if (no cookie 'cart-session-id') {
  set cookie 'cart-session-id' = crypto.randomUUID()
  // httpOnly: true, sameSite: 'lax', maxAge: 30 días, secure en prod
}
```

### 3.2 Endpoints nuevos

#### `POST /api/upload/signature`
Genera firma temporal para que el browser suba directo a Cloudinary.

```
Request:  { filename, contentType, fileSize }
Response: { signature, timestamp, apiKey, cloudName, folder, publicId, eager }
```

Validaciones server-side:
- `contentType ∈ ['image/jpeg','image/png','image/webp','image/svg+xml']`
- `fileSize ≤ 50 MB`
- Rate limit por `sessionId`: 20 firmas/hora
- Genera `publicId = estampanda/temp/{sessionId}/{uuid}`
- Genera `eager` para thumbnail (300×300 webp) y preview (800×800 png)

#### `POST /api/designs`
Registra en MongoDB un upload exitoso a Cloudinary.

```
Request:  { cloudinaryPublicId, originalFileUrl, width, height,
            fileType, fileSize, hasTransparency, name?, thumbnailUrl, previewUrl }
Response: { design: { id, ...allFields } }
```

Server:
- Verifica con Cloudinary Admin API que `publicId` existe (anti-spoofing)
- Crea `Design` con `sessionId` de cookie, `expiresAt = now + 24h`

#### `GET /api/designs`
Lista diseños de la sesión actual.

```
Query:    ?status=active (default)
Response: { designs: [...], total }
```

#### `PATCH /api/designs/[id]`
Actualiza `processedFileUrl` después de background removal en browser.

```
Request:  { processedFileUrl, processedPublicId, backgroundRemoved: true }
Response: { design: {...} }
```

Server: valida ownership por `sessionId`, valida que `processedPublicId` existe.

#### `DELETE /api/designs/[id]`
Borra un diseño manualmente.

```
Response: { success: true }
```

Server:
- Valida ownership por `sessionId`
- Si está en algún `CartItem`: rechaza con 409 Conflict
- Borra de Cloudinary + Mongo

#### `GET /api/cart`
Devuelve el carrito completo con designs poblados.

```
Response: {
  cart: {
    id, sessionId, items: [{ ..., design: {...} }],
    subtotal, expiresAt
  }
}
```

Si no existe: crea vacío. Touch `expiresAt`.

#### `POST /api/cart/items`
Añade un item al carrito.

```
Request:  { designId, material: { id }, size: { width, height, custom },
            cutType: { id }, quantity }
Response: { cart: {...} }
```

Server:
- Valida `designId` pertenece a la sesión
- Carga catálogo (materiales/cortes) para snapshot de `name` + `priceMultiplier`
- Calcula `dpi = (design.dimensions.width / size.width) * 2.54`
- Calcula `unitPrice` con `libs/pricing.js`
- Push item, touch `expiresAt`

#### `PATCH /api/cart/items/[itemId]`
Edita config o cantidad de un item.

```
Request:  { material?, size?, cutType?, quantity? }
Response: { cart: {...} }
```

Server: recalcula DPI y precio, touch `expiresAt`.

#### `DELETE /api/cart/items/[itemId]`
Saca item del carrito.

```
Response: { cart: {...} }
```

#### `GET /api/cron/cleanup-expired`
Job de limpieza diario. Ver Sección 7. Vercel Cron envía GET con header `Authorization: Bearer ${CRON_SECRET}`.

### 3.3 Endpoints existentes a eliminar

- `app/api/upload/route.js` (POST y DELETE) — base64 legacy
- `app/api/upload/design/route.js` (POST y GET) — reemplazado
- `app/api/test-cloudinary/route.js` — debug en producción

### 3.4 Rate limiting

Implementación in-memory simple (`Map` por `sessionId`), aceptable para MVP single-instance. Migrar a Upstash Redis cuando se escale a multi-region.

Límites:
- `POST /api/upload/signature`: 20/hora por sesión
- `POST/PATCH/DELETE /api/cart/items`: 100/hora por sesión

### 3.5 Variables de entorno nuevas

```
CRON_SECRET=<openssl rand -base64 32>
```

---

## 4. Upload técnico (signed direct upload)

### 4.1 Por qué este enfoque

Upload server-proxy actual tiene dos problemas fatales:
1. Vercel limita body de funciones a ~4.5 MB → archivos de 50 MB declarados disparan 413
2. Convertir a base64 infla 33 % y consume RAM del server

Signed direct upload elimina ambos: browser sube directo, server solo firma.

### 4.2 Diagrama de secuencia

```
Browser              Next.js API           Cloudinary           MongoDB
   │ 1. POST /api/upload/signature             │                  │
   │ {filename,type,size} →                    │                  │
   │ ← {signature, timestamp, ...}             │                  │
   │ 2. POST direct to Cloudinary                                 │
   │ ──────────────────────────────────────────→│                  │
   │ ←──────── {public_id, secure_url, eager} ──│                  │
   │ 3. POST /api/designs {publicId, ...}      │                  │
   │ ──────────────────────────────────────────→│  verify exists   │
   │                                            │ ─────────────────→
   │                                            │ create Design   │
   │ ←─ {design: {...}}                                            │
```

### 4.3 Implementación

**`app/api/upload/signature/route.js`** — ver Sección 3 + Sección 4 del documento de brainstorming. Código clave:

```javascript
const paramsToSign = {
  timestamp,
  folder: "estampanda",
  public_id: `temp/${sessionId}/${crypto.randomUUID()}`,
  eager: "c_fit,w_300,h_300,f_webp,q_auto:good|c_fit,w_800,h_800,f_png,q_auto:best",
};
const signature = cloudinary.utils.api_sign_request(
  paramsToSign,
  process.env.CLOUDINARY_API_SECRET
);
```

**`libs/cloudinary-client.js`** — wrapper en browser:

```javascript
export async function uploadDesignToCloudinary(file, onProgress) {
  // 1. Pedir firma
  const { signature, timestamp, apiKey, cloudName, folder, publicId, eager } =
    await fetchSignature(file);

  // 2. Subir directo a Cloudinary con XHR (para progress events)
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

  // 3. Notificar al server para crear Design en Mongo
  const { design } = await fetch("/api/designs", {
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
      name: file.name.split(".")[0],
    }),
  }).then(r => r.json());

  return design;
}
```

### 4.4 Eager transformations explicadas

Cloudinary genera durante el upload (no on-demand):
- `c_fit,w_300,h_300,f_webp,q_auto:good` → thumbnail
- `c_fit,w_800,h_800,f_png,q_auto:best` → preview con transparencia

Beneficio: el primer cliente que ve el thumbnail no espera generación.

### 4.5 Manejo de errores

| Falla | Estrategia |
|---|---|
| Signature endpoint cae | UI: "Servicio no disponible, reintenta" |
| Cloudinary upload cae a mitad | XHR rechaza, no se crea Design |
| `/api/designs` cae después de upload OK | Llamar `/api/upload/cleanup-orphan` (borra el publicId huérfano). Si falla → cron lo limpiará a las 24 h |
| Asset spoofing (cliente miente) | Server compara con Cloudinary Admin API y rechaza |
| Rate limit excedido | 429 con header `Retry-After` |

### 4.6 Costo de la verificación

`cloudinary.api.resource()` cuenta como 1 admin API call. Free tier: 500/hora → soporta 500 uploads/hora sin pagar. Para MVP suficiente.

---

## 5. Cambios en frontend

### 5.1 Mapa de archivos

| Archivo | Acción |
|---|---|
| `libs/cloudinary-client.js` | 🆕 wrapper signed direct upload |
| `libs/use-cart.js` | 🆕 hook React (SWR) para carrito |
| `libs/session-client.js` | 🆕 leer cookie `cart-session-id` desde browser si hace falta |
| `libs/pricing.js` | 🆕 lógica de precios única |
| `libs/background-removal.js` | 🆕 wrapper de @imgly |
| `components/stickers/FileUploader.js` | ✏️ refactor — usar `uploadDesignToCloudinary()` |
| `components/stickers/DesignPreview.js` | ✏️ simplificar — quitar mockups, añadir DPI badge + escala cm |
| `components/cart/CartDrawer.js` | 🆕 panel lateral con items |
| `components/cart/CartItemCard.js` | 🆕 item editable in-place |
| `components/cart/CartBadge.js` | 🆕 contador en Header |
| `components/Header.js` | ✏️ añadir `<CartBadge />` |
| `app/stickers/designer/page.js` | ✏️ orquestador del configurador |
| `app/cart/page.js` | 🆕 ruta — carrito completo en pantalla |
| `components/stickers/PricingCalculator.js` | 🗑️ duplicado, usar `libs/pricing.js` |
| `components/PriceCalculator.js` | ✏️ extraer lógica a `libs/pricing.js` |

### 5.2 `FileUploader.js` (refactor)

Reemplazar XHR + FormData → `/api/upload/design` por `uploadDesignToCloudinary()` (Sección 4.3). Quitar `FileReader` para preview local (usamos `design.thumbnailUrl` directo de Cloudinary). Quitar `removeBackground` checkbox.

### 5.3 `DesignPreview.js` (simplificación)

**Quitar:** `mockupViews` array (laptop/bottle/phone), botones de cambio de vista, `previewMode` state.

**Mantener:** `getMaterialEffect()` (filtros CSS), `getCutPath()` (clip-path).

**Añadir:**
- Badge de DPI (verde ≥ 300 / amarillo 200-299 / rojo < 200)
- Dimensiones reales overlay (regla de cm visible)
- Botón "Quitar fondo" (Sección 6)
- Botón "Añadir al carrito" primario
- Cálculo de DPI dinámico cuando cambia `size`:
  ```javascript
  const dpi = Math.round((designFile.dimensions.width / size.width) * 2.54);
  ```

### 5.4 Componentes de carrito

- **`CartBadge`**: contador en Header. Click → abre `CartDrawer` o navega a `/cart`.
- **`CartDrawer`** (desktop) y **`/cart` page** (móvil): lista de `CartItemCard`, subtotal, "Continuar a pago" (sub-proyecto #2 lo activará), "Vaciar carrito".
- **`CartItemCard`**: thumbnail 80×80, selectores in-place de material/tamaño/corte/cantidad, precio, botón borrar. Cambios disparan `PATCH /api/cart/items/[id]` con debounce 300 ms.

### 5.5 Hook `useCart` con SWR

```javascript
// libs/use-cart.js
export function useCart() {
  const { data, mutate, isLoading } = useSWR("/api/cart", fetcher);

  const addItem = async (item) => {
    await fetch("/api/cart/items", { method: "POST", body: JSON.stringify(item) });
    mutate();
  };

  const updateItem = async (itemId, patch) => {
    await fetch(`/api/cart/items/${itemId}`, { method: "PATCH", body: JSON.stringify(patch) });
    mutate();
  };

  const removeItem = async (itemId) => {
    await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    mutate();
  };

  return {
    cart: data?.cart,
    items: data?.cart?.items ?? [],
    subtotal: data?.cart?.subtotal ?? 0,
    isLoading,
    addItem,
    updateItem,
    removeItem,
  };
}
```

### 5.6 `libs/pricing.js` (centralizar lógica)

Hoy hay dos calculadoras (`PriceCalculator.js` y `stickers/PricingCalculator.js`) que probablemente divergen. Extraer a:

```javascript
export function calculateUnitPrice({ basePricePerCm2, size, material, cutType, quantity }) {
  const area = size.width * size.height;
  const base = area * basePricePerCm2;
  const withMaterial = base * material.priceMultiplier;
  const withCut = withMaterial * cutType.priceMultiplier;
  const volumeDiscount = getVolumeDiscount(quantity);
  return withCut * (1 - volumeDiscount);
}

export function getVolumeDiscount(qty) {
  if (qty >= 500) return 0.30;
  if (qty >= 200) return 0.20;
  if (qty >= 100) return 0.15;
  if (qty >= 50)  return 0.10;
  return 0;
}
```

Usado en frontend (preview en vivo) y backend (`POST /api/cart/items`).

> Los multipliers exactos y precios base son **decisiones de negocio** que ya están en componentes existentes. Mover sin cambiar valores.

### 5.7 Layout del configurador `/stickers/designer/page.js`

```
┌─────────────────────────────────────────┐
│  [FileUploader] (paso 1)                │
│                                          │
│  → cuando hay diseño subido:             │
│                                          │
│  ┌─────────────┬───────────────────┐    │
│  │             │                    │    │
│  │ DesignPrev  │ MaterialSelector   │    │
│  │ (sticky)    │ SizeSelector       │    │
│  │             │ CutTypeSelector    │    │
│  │ DPI badge   │ QuantitySelector   │    │
│  │ "10 cm"     │                    │    │
│  │             │ Precio: $480       │    │
│  │ [Quitar bg] │ [Añadir al carrito]│    │
│  └─────────────┴───────────────────┘    │
└─────────────────────────────────────────┘
```

Estado local: `{ design, material, size, cutType, quantity }`. Click "Añadir al carrito" → `addItem(...)` → toast → opción "Añadir otro diseño" o "Ir al carrito".

---

## 6. Background removal en browser

### 6.1 Librería

**`@imgly/background-removal`** (MIT). Modelo U²-Net cuantizado. Runtime: WebAssembly + ONNX. Tamaño: 70-80 MB primera vez, cacheado por browser. Procesamiento: 3-15 s desktop, 10-30 s móvil.

### 6.2 Instalación

```bash
npm install @imgly/background-removal
```

### 6.3 Flujo end-to-end

```
1. Cliente click "Quitar fondo" en preview
2. Verificar si modelo ya está cacheado (sí → paso 4)
3. Lazy import + descarga modelo. UI: "Preparando herramienta… 35%"
4. Procesar imagen (5-30 s). UI: animación + "Quitando fondo…"
5. Pedir signature al server (reusa `POST /api/upload/signature`, sufijo `_nobg` en publicId)
6. Upload del blob procesado a Cloudinary (helper cliente `uploadProcessedToCloudinary` en `libs/cloudinary-client.js`, no es endpoint del server)
7. PATCH /api/designs/[id] con {processedFileUrl, processedPublicId, backgroundRemoved: true}
8. UI swap preview a processedFileUrl + botón "Volver al original"
```

### 6.4 Implementación

**`libs/background-removal.js`** — lazy load:

```javascript
let removeBackgroundFn = null;

async function loadModule() {
  if (!removeBackgroundFn) {
    const mod = await import("@imgly/background-removal");
    removeBackgroundFn = mod.removeBackground;
  }
  return removeBackgroundFn;
}

export async function removeBackgroundFromUrl(imageUrl, onProgress) {
  const removeBackground = await loadModule();
  return await removeBackground(imageUrl, {
    progress: (key, current, total) => {
      onProgress?.(key, Math.round((current / total) * 100));
    },
    output: { format: "image/png", quality: 0.95 },
    model: "medium", // small | medium (default) | large
  });
}
```

**Botón en `DesignPreview.js`** — estados: `idle | loading | processing | uploading | done | error`. Mensajes de fase: "Preparando herramienta…" / "Quitando fondo…" / "Guardando resultado…". Mientras procesa, mostrar visiblemente:

> 🔒 Tu imagen no sale de tu navegador

### 6.5 Configuración de Next.js

**`next.config.js`:**

```javascript
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  async headers() {
    return [{
      source: "/_next/static/wasm/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
};
```

### 6.6 UX detalles

- **1ª vez vs 2ª vez**: la primera vez descarga 80 MB. Mensaje: *"Preparando herramienta… (esto solo pasa la primera vez, ~10s)"*. En visitas posteriores, instantáneo.
- **Privacidad como feature**: ventaja competitiva real frente a remove.bg/Cloudinary. Mensaje visible.
- **Detección de baja capacidad**: si `navigator.hardwareConcurrency < 4` o `navigator.deviceMemory < 4`, warning antes de iniciar: *"Quitar el fondo puede tomar 30+ segundos en tu dispositivo. ¿Continuar?"*.

### 6.7 Fallback de error

Mensaje: *"No pudimos procesar esta imagen. Intenta con un PNG transparente o contacta soporte."* No fallback automático a Cloudinary AI ($0.12).

### 6.8 Bundle size

`@imgly/background-removal` se carga con dynamic import → **NO afecta el bundle inicial**. Verificable con `next build --analyze`.

---

## 7. Cleanup job (cron diario)

### 7.1 Configuración Vercel Cron

**`vercel.json`:**

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-expired",
      "schedule": "0 3 * * *"
    }
  ]
}
```

> Hobby: 1 cron, máx diario. Pro: 40 crons. Plan Hobby suficiente para MVP.

### 7.2 Endpoint `app/api/cron/cleanup-expired/route.js`

```javascript
export const maxDuration = 60;

export async function GET(req) {
  // Auth via Bearer ${CRON_SECRET}
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const now = new Date();
  const stats = { cartsDeleted: 0, designsDeleted: 0, cloudinaryDeleted: 0, cloudinaryFailed: 0, errors: [] };

  // 1. Borrar carritos expirados
  const expiredCarts = await Cart.find({ expiresAt: { $lt: now } });
  if (expiredCarts.length > 0) {
    await Cart.deleteMany({ _id: { $in: expiredCarts.map(c => c._id) } });
    stats.cartsDeleted = expiredCarts.length;
  }

  // 2. Diseños huérfanos: expirados Y no referenciados por Cart vivo u Order
  const expiredDesigns = await Design.find({ expiresAt: { $lt: now }, status: "active" });

  for (const design of expiredDesigns) {
    const inCart = await Cart.exists({ "items.designId": design._id });
    const inOrder = await Order.exists({ designUrl: design.originalFileUrl });

    if (inCart || inOrder) {
      // Extender 24h más
      design.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      await design.save();
      continue;
    }

    // Cloudinary primero, Mongo después
    try {
      await cloudinary.uploader.destroy(design.cloudinaryPublicId);
      if (design.cloudinaryProcessedPublicId) {
        await cloudinary.uploader.destroy(design.cloudinaryProcessedPublicId);
      }
      stats.cloudinaryDeleted++;
    } catch (e) {
      stats.cloudinaryFailed++;
      stats.errors.push({ publicId: design.cloudinaryPublicId, error: e.message });
      continue; // No borrar de Mongo si Cloudinary falló
    }

    await Design.deleteOne({ _id: design._id });
    stats.designsDeleted++;
  }

  return NextResponse.json({ ok: true, stats, runAt: now.toISOString() });
}
```

### 7.3 Decisiones explicadas

1. **Cloudinary primero, MongoDB segundo**: si la API de Cloudinary falla, el doc en Mongo se mantiene (con su `publicId`) y reintenta mañana. Evita huérfanos.
2. **No-cascade del Cart al Design**: cada uno tiene su propio `expiresAt`. Si el Design está en un Cart vivo, se le extiende.
3. **Defensa contra borrar Designs en uso**: verifica `Cart.items.designId` y `Order.designUrl`.
4. **Endpoint GET**: convención de Vercel Cron.
5. **`maxDuration = 60`**: máx en plan Hobby. Para MVP con < 1000 designs/día sobra.

### 7.4 Plan de testing manual

1. `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/cleanup-expired`
2. Verificar que un Design con `expiresAt` en el pasado se borra de Cloudinary y Mongo
3. Verificar que un Design en un Cart vivo NO se borra (extiende `expiresAt`)
4. Verificar 401 sin el header

---

## 8. Limpieza de código legacy

### 8.1 En `libs/cloudinary.js`

| Función | Acción |
|---|---|
| `uploadToCloudinary` (genérica) | 🗑️ borrar (duplicada con `uploadStickerDesign`) |
| `applyMockup` | 🗑️ borrar (overlays no existen) |
| `generateStickerSheet` | 🗑️ borrar (asset base no existe, YAGNI) |
| `removeBackground` (server-side) | 🗑️ borrar (reemplazado por @imgly cliente) |
| `optimizeForPrint` | ✏️ marcar deprecated, mover a TODO fase 2 (útil para proof) |
| `uploadStickerDesign` | ✏️ renombrar a `uploadProcessedToCloudinary` (uso opcional desde server) |
| `deleteFromCloudinary` | ✅ mantener (usado en cleanup cron) |

**Función nueva añadir:** `getSignatureForUpload` (helper para `/api/upload/signature`).

### 8.2 En `app/api/`

| Endpoint | Acción |
|---|---|
| `app/api/upload/route.js` | 🗑️ borrar archivo |
| `app/api/upload/design/route.js` | 🗑️ borrar archivo |
| `app/api/test-cloudinary/route.js` | 🗑️ borrar archivo |

### 8.3 En `.env.example`

Quitar:
- `GOOGLE_ID`, `GOOGLE_SECRET` (no usado)
- `RESEND_API_KEY` (no instalado)
- `TWILIO_*` (no usado)
- `SHIPPO_API_KEY` (sub-proyecto futuro)
- `REMOVE_BG_API_KEY` (reemplazado por @imgly)

Añadir:
- `CRON_SECRET=<openssl rand -base64 32>`

### 8.4 En `config.js`

- Borrar bloque `resend`
- Borrar bloque `aws`

### 8.5 Documentación a actualizar al final

- `STATUS.md` — actualizar Sprint 3 y marcar Cloudinary como ✅
- `CLAUDE.md` — añadir "Architecture overview" del módulo upload/carrito
- `README.md` — actualizar variables de entorno

---

## 9. Plan de migración (orden de implementación)

5 fases secuenciales con verificación antes de seguir:

### Fase A — Fundamentos backend (1-2 días)
1. `middleware.js` — `getOrCreateSession` cookie
2. `libs/session.js` server helpers
3. `libs/rate-limit.js` in-memory
4. `libs/pricing.js` (extraer de calculadoras)
5. Refactor `models/Design.js`
6. Crear `models/Cart.js`

✅ **Verificación:** seed manual → crear Cart con `mongo shell`, leer con `Cart.find()`, ver que sessionId persiste.

### Fase B — APIs (1-2 días)
1. `POST /api/upload/signature`
2. `/api/designs` (POST, GET, PATCH, DELETE)
3. `/api/cart` (GET) y `/api/cart/items` (POST, PATCH, DELETE)
4. Borrar endpoints legacy

✅ **Verificación:** suite de `curl` que recorre el flujo (firma → upload → Design → Cart → editar → borrar).

### Fase C — Frontend upload + carrito (2-3 días)
1. `libs/cloudinary-client.js`
2. `libs/use-cart.js`
3. Refactor `FileUploader.js`
4. Componentes `CartBadge`, `CartItemCard`, `CartDrawer`, ruta `/cart`
5. Refactor `DesignPreview.js`
6. Orquestación `/stickers/designer/page.js`

✅ **Verificación:** flujo manual end-to-end en `npm run dev`: subir, configurar, añadir, editar cantidad, eliminar.

### Fase D — Background removal (1-2 días)
1. `npm install @imgly/background-removal`
2. `libs/background-removal.js`
3. Botón en `DesignPreview.js`
4. Configurar `next.config.js`
5. `PATCH /api/designs/[id]` para `processedFileUrl`

✅ **Verificación:** subir PNG con fondo → click "Quitar fondo" → ver progreso → ver resultado → añadir al carrito con versión procesada.

### Fase E — Cron + producción (1 día)
1. `app/api/cron/cleanup-expired/route.js`
2. `vercel.json` con cron
3. Generar `CRON_SECRET`, añadir en `.env.local` y Vercel dashboard
4. Testing manual con `curl`
5. Limpieza final: borrar legacy, actualizar `.env.example`, `STATUS.md`

✅ **Verificación:** crear Design + Cart con `expiresAt` en el pasado, llamar cron, ver logs, confirmar borrado total.

### Estimado total: 6-10 días (1.5–2 semanas calendario con buffer)

---

## Apéndice A: Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Direct upload con CORS issues si Cloudinary cambia política | Probar tempranamente en Fase B con dev cloud_name. Documentar `Allowed Origins` en Cloudinary settings. |
| `@imgly/background-removal` rompe en navegador minoritario | Feature check (WebAssembly + WASM SIMD); ocultar el botón si no soporta. |
| Vercel Cron Hobby tiene 1 cron máximo | Solo necesitamos 1, no es bloqueante. |
| MongoDB Atlas free tier (M0) se llena | Cleanup se ocupa, monitorear primeros días. |
| Refactor del Design rompe queries existentes | Confirmado: no hay datos en producción. |

## Apéndice B: Variables de entorno finales

Después de aplicar este sub-proyecto, las env vars **realmente usadas** son:

```
# MongoDB
MONGODB_URI=

# JWT del admin (libs/simple-auth.js)
NEXTAUTH_SECRET=

# Admin credentials
ADMIN_USERNAME=
ADMIN_PASSWORD=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=estampanda-stickers

# Stripe (sub-proyecto #2 lo activará)
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Cron de limpieza
CRON_SECRET=
```

## Apéndice C: Glosario

- **sessionId** — UUID en cookie `cart-session-id`, identifica al cliente anónimo entre uploads y entre sesiones.
- **CartItem** — subdocumento embebido en `Cart.items` representando un sticker configurado (design + material + tamaño + corte + cantidad + precio).
- **Eager transformations** — variantes de imagen generadas durante el upload (no on-demand). Configuradas en signature.
- **Direct signed upload** — patrón donde el browser sube directo al CDN con una firma temporal del server, evitando proxy.
- **DPI estimado** — `(width_px / size_cm) × 2.54`. Mide si la resolución del archivo soporta el tamaño de impresión.
- **TTL del carrito** — 24 h sin actividad. Recalculado en cada touch (add/edit/delete item).

---

**Próximo paso:** invocar `superpowers:writing-plans` para descomponer este spec en un plan de implementación detallado paso a paso, listo para ejecutar (o pasarse a otra sesión via `superpowers:executing-plans`).
