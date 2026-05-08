# Upload de diseños + Carrito anónimo persistente — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Adaptaciones al proyecto:**
> - Sin framework de tests automatizados (CLAUDE.md lo prohíbe hoy). "Tests" = `curl` para backend + verificación manual en browser para frontend.
> - Reglas del usuario prohíben commits automáticos. Cada task termina con un *suggested commit checkpoint* — el agente debe DETENERSE y pedir permiso antes de commitear.
> - No worktree dedicada — trabajo sobre `main`.

**Goal:** Habilitar al cliente anónimo a subir múltiples diseños a Cloudinary, configurarlos, mantener un carrito persistente con TTL de 24 h, y limpieza automática.

**Architecture:** Direct signed upload (browser → Cloudinary), sesión anónima por cookie httpOnly, modelo `Cart` con items embebidos, cron diario de limpieza, background removal client-side con `@imgly/background-removal`.

**Tech Stack:** Next.js 15 (App Router), MongoDB + Mongoose 8, Cloudinary SDK v2, SWR (nuevo), `@imgly/background-removal` (nuevo), Vercel Cron.

**Spec source:** `docs/superpowers/specs/2026-05-08-uploads-carrito-anonimo-design.md`

---

## File structure overview

### Files to create
```
libs/
├── session.js                  # cookie-based session helpers (server)
├── session-client.js           # leer cookie desde browser si hace falta
├── rate-limit.js               # in-memory rate limit
├── pricing.js                  # única fuente de cálculo de precios
├── cloudinary-client.js        # signed direct upload helpers (browser)
├── background-removal.js       # @imgly wrapper (lazy load)
└── use-cart.js                 # SWR hook para carrito

models/
└── Cart.js                     # nuevo modelo

app/api/
├── upload/signature/route.js
├── upload/cleanup-orphan/route.js
├── designs/route.js
├── designs/[id]/route.js
├── cart/route.js
├── cart/items/route.js
├── cart/items/[itemId]/route.js
└── cron/cleanup-expired/route.js

app/cart/page.js                # ruta nueva del carrito
components/cart/
├── CartBadge.js
├── CartDrawer.js
└── CartItemCard.js
```

### Files to modify
```
middleware.js                          # añadir cookie cart-session-id
models/Design.js                       # refactor destructivo
config.js                              # quitar resend y aws blocks
.env.example                           # quitar legacy, añadir CRON_SECRET
next.config.js                         # WASM support para @imgly
vercel.json                            # añadir cron schedule
package.json                           # nuevas deps: swr, @imgly/background-removal

components/stickers/FileUploader.js    # usar nuevo flow
components/stickers/DesignPreview.js   # quitar mockups, añadir DPI badge
components/Header.js                   # añadir CartBadge
app/stickers/designer/page.js          # orquestar nuevo flujo
components/PriceCalculator.js          # extraer a libs/pricing.js
```

### Files to delete
```
app/api/upload/route.js                # base64 legacy
app/api/upload/design/route.js         # reemplazado
app/api/test-cloudinary/route.js       # debug
components/stickers/PricingCalculator.js  # duplicado
```

### Functions to delete from libs/cloudinary.js
- `uploadToCloudinary` (genérica)
- `applyMockup`
- `generateStickerSheet`
- `removeBackground` (server-side)

---

## Setup

- [ ] **Step 0.1: Verificar Node y deps actuales**

  ```bash
  node --version    # debe ser ≥ 20
  cat package.json | grep -E '"next"|"mongoose"|"cloudinary"'
  ```

  Esperado: Node 20.x, Next 15.4.x, mongoose 8.x, cloudinary 2.x.

- [ ] **Step 0.2: Instalar nuevas dependencias**

  ```bash
  npm install swr @imgly/background-removal
  ```

  Esperado: `swr` y `@imgly/background-removal` aparecen en `package.json` y se instalan sin errores.

- [ ] **Step 0.3: Generar CRON_SECRET y añadirlo a `.env.local`**

  ```bash
  openssl rand -base64 32
  ```

  Copiar el valor. Editar `.env.local` y añadir:
  ```
  CRON_SECRET=<valor-generado>
  ```

  No commitear `.env.local` (está en `.gitignore`).

- [ ] **✋ Suggested commit checkpoint** — pedir permiso al usuario para hacer commit del `package.json` y `package-lock.json`. Mensaje sugerido: `chore: añadir deps swr y @imgly/background-removal`.

---

## Fase A — Fundamentos backend (~1-2 días)

Producir: piezas de soporte (sesión, rate-limit, pricing) + modelos `Design` refactorizado y `Cart` nuevo.

### Task A1: Cookie session middleware

**Files:**
- Modify: `middleware.js`
- Create: `libs/session.js`

- [ ] **Step A1.1: Leer `middleware.js` actual**

  Verificar que solo protege `/admin/*` con cookie `auth-token`. Confirmar que no toca `/stickers`, `/cart`, ni `/api/*` excepto admin.

- [ ] **Step A1.2: Modificar `middleware.js`** para añadir lógica de sesión anónima

  Reemplazar todo el archivo por:

  ```javascript
  import { NextResponse } from 'next/server';

  const SESSION_COOKIE = 'cart-session-id';
  const SESSION_PATHS = /^\/(stickers|cart|api\/(cart|designs|upload(?!\/signature\/.*placeholder)))/;
  // Match: /stickers/*, /cart, /cart/*, /api/cart/*, /api/designs/*, /api/upload/*

  export function middleware(request) {
    const { pathname } = request.nextUrl;

    // 1. Proteger /admin (lógica existente)
    if (pathname.startsWith('/admin')) {
      const token = request.cookies.get('auth-token');
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.next();
    }

    // 2. Asegurar cookie cart-session-id en rutas relevantes
    const isSessionPath =
      pathname.startsWith('/stickers') ||
      pathname.startsWith('/cart') ||
      pathname.startsWith('/api/cart') ||
      pathname.startsWith('/api/designs') ||
      pathname.startsWith('/api/upload');

    if (isSessionPath && !request.cookies.get(SESSION_COOKIE)) {
      const response = NextResponse.next();
      response.cookies.set(SESSION_COOKIE, crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: '/',
      });
      return response;
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: [
      '/admin/:path*',
      '/stickers/:path*',
      '/cart/:path*',
      '/api/cart/:path*',
      '/api/designs/:path*',
      '/api/upload/:path*',
    ],
  };
  ```

- [ ] **Step A1.3: Crear `libs/session.js`** (helpers server-side)

  ```javascript
  import { cookies } from 'next/headers';

  const SESSION_COOKIE = 'cart-session-id';

  /**
   * Lee la cookie de sesión. La cookie se garantiza por middleware
   * en rutas protegidas, pero como fallback la creamos aquí también.
   */
  export async function getOrCreateSession() {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      cookieStore.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return sessionId;
  }

  /**
   * Lee la cookie de sesión sin crearla. Devuelve null si no existe.
   */
  export async function getSession() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value ?? null;
  }
  ```

- [ ] **Step A1.4: Verificación manual del middleware**

  ```bash
  npm run dev
  ```

  En otra terminal:
  ```bash
  curl -i http://localhost:3000/stickers/designer 2>&1 | grep -i 'set-cookie'
  ```

  Esperado: header `Set-Cookie: cart-session-id=<uuid>; Path=/; ...`. El UUID debe parecerse a `8b5a...`.

  Repetir el curl con `-b "cart-session-id=test123"` y confirmar que NO se asigna nueva cookie (la existente persiste).

- [ ] **✋ Suggested commit checkpoint** — `feat(session): cookie cart-session-id en middleware y helpers`.

---

### Task A2: Rate limit in-memory

**Files:**
- Create: `libs/rate-limit.js`

- [ ] **Step A2.1: Crear `libs/rate-limit.js`**

  ```javascript
  /**
   * Rate limit in-memory simple. Map<key, [timestamps]>.
   * Cada timestamp = ms en que ocurrió un hit.
   * Limpia entradas expiradas en cada check.
   *
   * NOTA: solo funciona en single-instance. Para multi-region en Vercel,
   * migrar a Upstash Redis. TODO: distributed rate limit.
   */

  const buckets = new Map();

  export function checkRateLimit(key, maxHits, windowSeconds) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    const hits = buckets.get(key) ?? [];
    const recent = hits.filter((t) => t > windowStart);

    if (recent.length >= maxHits) {
      buckets.set(key, recent);
      return { allowed: false, remaining: 0, resetAt: recent[0] + windowMs };
    }

    recent.push(now);
    buckets.set(key, recent);
    return { allowed: true, remaining: maxHits - recent.length, resetAt: now + windowMs };
  }
  ```

- [ ] **Step A2.2: Verificación manual con Node REPL**

  ```bash
  node -e "
  const { checkRateLimit } = require('./libs/rate-limit.js');
  for (let i = 0; i < 5; i++) console.log(i, checkRateLimit('test', 3, 60));
  "
  ```

  Esperado:
  - Calls 0, 1, 2 → `{ allowed: true, ... }`
  - Calls 3, 4 → `{ allowed: false, remaining: 0, ... }`

  > Si Node CommonJS no le agrada al import `.js` con ESM, ejecuta el ejemplo en el dev server ya que el proyecto usa ESM.

- [ ] **✋ Suggested commit checkpoint** — `feat(rate-limit): in-memory rate limit helper`.

---

### Task A3: Centralizar lógica de precios en `libs/pricing.js`

**Files:**
- Create: `libs/pricing.js`
- Modify: `components/PriceCalculator.js` (extraer lógica)
- Delete: `components/stickers/PricingCalculator.js`

- [ ] **Step A3.1: Leer ambas calculadoras existentes**

  ```bash
  cat components/PriceCalculator.js components/stickers/PricingCalculator.js
  ```

  Identificar: `basePricePerCm2`, multipliers de material, multipliers de cutType, escalones de descuento por volumen.

- [ ] **Step A3.2: Crear `libs/pricing.js`** con la lógica unificada

  ```javascript
  /**
   * Lógica única de cálculo de precios.
   * Usada en frontend (preview en vivo) y backend (POST /api/cart/items).
   *
   * IMPORTANTE: los valores numéricos son decisiones de negocio.
   * Mantener sincronizados con MaterialSelector.js y CutTypeSelector.js.
   */

  // MXN por cm² — base. Valor real debe copiarse del actual `components/PriceCalculator.js`
  // (revisar ese archivo y poner exactamente el mismo número aquí). Si no existe valor
  // explícito, derivar del cálculo que hace hoy: ej. si un sticker 5x5 cm vale $X,
  // entonces BASE_PRICE_PER_CM2 = X / 25.
  export const BASE_PRICE_PER_CM2 = 4; // ⚠ EDITAR: copiar del PriceCalculator.js antes de continuar

  /**
   * Calcula el precio unitario (1 sticker) según config.
   * @param {Object} args
   * @param {{width:number, height:number}} args.size  - cm
   * @param {{priceMultiplier:number}} args.material
   * @param {{priceMultiplier:number}} args.cutType
   * @param {number} args.quantity                       - para descuento por volumen
   * @returns {number} precio unitario en MXN
   */
  export function calculateUnitPrice({ size, material, cutType, quantity }) {
    const area = size.width * size.height;
    const base = area * BASE_PRICE_PER_CM2;
    const withMaterial = base * material.priceMultiplier;
    const withCut = withMaterial * cutType.priceMultiplier;
    const discount = getVolumeDiscount(quantity);
    return Math.round(withCut * (1 - discount) * 100) / 100;
  }

  /**
   * Devuelve la fracción de descuento por volumen [0..1).
   */
  export function getVolumeDiscount(qty) {
    if (qty >= 500) return 0.30;
    if (qty >= 200) return 0.20;
    if (qty >= 100) return 0.15;
    if (qty >= 50)  return 0.10;
    return 0;
  }

  export function calculateTotalPrice(args) {
    return Math.round(calculateUnitPrice(args) * args.quantity * 100) / 100;
  }
  ```

  > **Acción del implementador:** ajustar `BASE_PRICE_PER_CM2` al valor que ya hay en `PriceCalculator.js`. NO inventar — copiarlo del existente.

- [ ] **Step A3.3: Refactor `components/PriceCalculator.js`** para usar `libs/pricing.js`

  Reemplazar la función interna de cálculo por:
  ```javascript
  import { calculateUnitPrice, calculateTotalPrice } from "@/libs/pricing";
  ```

  Y dentro del componente:
  ```javascript
  const unitPrice = calculateUnitPrice({ size, material, cutType, quantity });
  const totalPrice = calculateTotalPrice({ size, material, cutType, quantity });
  ```

- [ ] **Step A3.4: Borrar `components/stickers/PricingCalculator.js`**

  ```bash
  rm components/stickers/PricingCalculator.js
  ```

  Buscar referencias antes:
  ```bash
  grep -rn "stickers/PricingCalculator" --include="*.js" --include="*.jsx"
  ```

  Si hay imports → cambiarlos a `@/components/PriceCalculator` (o al hook `libs/pricing` si es lógica pura).

- [ ] **Step A3.5: Verificación manual**

  ```bash
  npm run dev
  ```

  Navegar a `/stickers/designer`, configurar un sticker, verificar que el precio se calcula igual que antes (sanity check).

- [ ] **✋ Suggested commit checkpoint** — `refactor(pricing): centralizar lógica en libs/pricing.js`.

---

### Task A4: Refactor del modelo `Design`

**Files:**
- Modify: `models/Design.js`

- [ ] **Step A4.1: Vaciar la colección de pruebas**

  ```bash
  # Conectar a la DB y borrar designs viejos (asume sin datos en producción)
  # Usar mongosh o el conector de tu IDE:
  # use estampanda
  # db.designs.deleteMany({})
  ```

  Esto evita que el refactor destructivo deje docs con campos rotos.

- [ ] **Step A4.2: Reescribir `models/Design.js`**

  Reemplazar todo el archivo por:

  ```javascript
  import mongoose from "mongoose";
  import toJSON from "./plugins/toJSON";

  const designSchema = mongoose.Schema(
    {
      // Identidad: uno de los dos requerido (validación pre-save)
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      sessionId: {
        type: String,
        required: false,
        index: true,
      },

      name: {
        type: String,
        required: true,
        default: "Sin título",
      },

      // Cloudinary
      cloudinaryPublicId: { type: String, required: true },
      cloudinaryProcessedPublicId: { type: String },
      cloudinaryFolder: { type: String },

      originalFileUrl: { type: String, required: true },
      thumbnailUrl: String,
      previewUrl: String,
      processedFileUrl: String,

      // Metadata de archivo
      fileType: {
        type: String,
        required: true,
        enum: ["jpg", "jpeg", "png", "svg", "webp"],
      },
      fileSize: { type: Number, required: true },
      dimensions: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
      },
      hasTransparency: { type: Boolean, default: false },

      // Estado
      status: {
        type: String,
        default: "active",
        enum: ["active", "deleted"],
      },
      processingStatus: {
        backgroundRemoved: { type: Boolean, default: false },
        optimized: { type: Boolean, default: true },
      },

      // Lifecycle: null = no expira (vinculado a Order pagada)
      expiresAt: { type: Date, index: true },
    },
    { timestamps: true }
  );

  designSchema.index({ sessionId: 1, status: 1 });
  designSchema.index({ userId: 1, status: 1 });

  designSchema.pre("save", function (next) {
    if (!this.userId && !this.sessionId) {
      return next(new Error("Design requires either userId or sessionId"));
    }
    next();
  });

  designSchema.plugin(toJSON);

  export default mongoose.models.Design || mongoose.model("Design", designSchema);
  ```

- [ ] **Step A4.3: Buscar callers que rompan**

  ```bash
  grep -rn "Design\." --include="*.js" app/ components/ libs/ | grep -v node_modules
  ```

  Identificar archivos que usen campos eliminados (`isPublic`, `isTemplate`, `usageCount`, `likes`, `aiGenerated`, `category`, `metadata`, `incrementUsage`). Anotarlos para corregir en tasks de cleanup (Fase E).

- [ ] **Step A4.4: Verificación manual con script**

  ```bash
  node -e "
  require('dotenv').config({ path: '.env.local' });
  (async () => {
    await import('./libs/mongoose.js').then(m => m.default());
    const Design = (await import('./models/Design.js')).default;

    const ok = await Design.create({
      sessionId: 'test-session-123',
      name: 'Test',
      cloudinaryPublicId: 'test/abc',
      originalFileUrl: 'https://example.com/abc.png',
      fileType: 'png',
      fileSize: 1000,
      dimensions: { width: 800, height: 800 },
    });
    console.log('OK created:', ok._id);
    await Design.deleteOne({ _id: ok._id });

    try {
      await Design.create({ name: 'Bad', cloudinaryPublicId: 'x', originalFileUrl: 'y', fileType: 'png', fileSize: 1, dimensions: { width: 1, height: 1 }});
    } catch (e) {
      console.log('Validation works:', e.message);
    }
    process.exit(0);
  })();
  "
  ```

  Esperado:
  - `OK created: <ObjectId>`
  - `Validation works: Design requires either userId or sessionId`

- [ ] **✋ Suggested commit checkpoint** — `refactor(design): soportar guests con sessionId, quitar campos heredados`.

---

### Task A5: Modelo `Cart` nuevo

**Files:**
- Create: `models/Cart.js`

- [ ] **Step A5.1: Crear `models/Cart.js`**

  ```javascript
  import mongoose from "mongoose";
  import toJSON from "./plugins/toJSON";

  const cartItemSchema = new mongoose.Schema(
    {
      designId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Design",
        required: true,
      },

      // Snapshot de configuración (mutable post-add)
      material: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        priceMultiplier: { type: Number, required: true },
      },
      size: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        label: String,
        custom: Boolean,
      },
      cutType: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        priceMultiplier: { type: Number, required: true },
      },
      quantity: { type: Number, required: true, min: 1 },

      // Precio (calculado y persistido al añadir/editar)
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },

      // DPI snapshot
      dpi: Number,
      dpiWarning: { type: Boolean, default: false },

      addedAt: { type: Date, default: Date.now },
      updatedAt: Date,
    },
    { _id: true } // cada item tiene _id para edit/delete
  );

  const cartSchema = mongoose.Schema(
    {
      sessionId: { type: String, required: true, unique: true, index: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

      items: [cartItemSchema],

      expiresAt: { type: Date, required: true, index: true },
    },
    { timestamps: true }
  );

  /**
   * Recalcula expiresAt = updatedAt + 24h cada vez que se modifica el carrito.
   */
  cartSchema.pre("save", function (next) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    next();
  });

  /**
   * Subtotal virtual (suma de items.totalPrice).
   */
  cartSchema.virtual("subtotal").get(function () {
    return this.items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
  });

  cartSchema.set("toJSON", { virtuals: true });
  cartSchema.plugin(toJSON);

  export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
  ```

- [ ] **Step A5.2: Verificación manual**

  ```bash
  node -e "
  require('dotenv').config({ path: '.env.local' });
  (async () => {
    await import('./libs/mongoose.js').then(m => m.default());
    const Cart = (await import('./models/Cart.js')).default;

    const cart = await Cart.create({
      sessionId: 'test-session-' + Date.now(),
      items: [],
    });
    console.log('Created:', cart._id, 'expiresAt:', cart.expiresAt);

    // Touch
    cart.items.push({
      designId: new (await import('mongoose')).default.Types.ObjectId(),
      material: { id: 'matte', name: 'Mate', priceMultiplier: 1 },
      size: { width: 5, height: 5, custom: false },
      cutType: { id: 'square', name: 'Cuadrado', priceMultiplier: 1 },
      quantity: 100,
      unitPrice: 10,
      totalPrice: 1000,
    });
    await cart.save();
    console.log('After touch, subtotal:', cart.subtotal);

    await Cart.deleteOne({ _id: cart._id });
    process.exit(0);
  })();
  "
  ```

  Esperado: `Created: <ObjectId> expiresAt: <fecha 24h adelante>` y `After touch, subtotal: 1000`.

- [ ] **✋ Suggested commit checkpoint** — `feat(cart): modelo Cart con items embebidos y TTL 24h`.

---

## Fase B — Endpoints API (~1-2 días)

Producir: APIs probables con `curl`. Al final de esta fase, todo el flujo de upload + carrito funciona vía HTTP.

### Task B1: `POST /api/upload/signature`

**Files:**
- Create: `app/api/upload/signature/route.js`

- [ ] **Step B1.1: Crear el endpoint**

  ```javascript
  import { NextResponse } from "next/server";
  import { v2 as cloudinary } from "cloudinary";
  import { getOrCreateSession } from "@/libs/session";
  import { checkRateLimit } from "@/libs/rate-limit";

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const MAX_SIZE = 50 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  const FOLDER_BASE = "estampanda";
  const EAGER =
    "c_fit,w_300,h_300,f_webp,q_auto:good|c_fit,w_800,h_800,f_png,q_auto:best";

  export async function POST(req) {
    const sessionId = await getOrCreateSession();

    const rl = checkRateLimit(`upload:${sessionId}`, 20, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many uploads. Reintenta más tarde." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { contentType, fileSize } = body;

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Tipo de archivo no soportado. Usa JPG, PNG, WebP o SVG." },
        { status: 400 }
      );
    }
    if (typeof fileSize !== "number" || fileSize <= 0 || fileSize > MAX_SIZE) {
      return NextResponse.json(
        { error: "Tamaño inválido. Máximo 50 MB." },
        { status: 400 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const publicId = `temp/${sessionId}/${crypto.randomUUID()}`;
    const folder = FOLDER_BASE;

    const paramsToSign = {
      timestamp,
      folder,
      public_id: publicId,
      eager: EAGER,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
      publicId,
      eager: EAGER,
    });
  }
  ```

- [ ] **Step B1.2: Verificación con curl**

  ```bash
  npm run dev
  ```

  En otra terminal:
  ```bash
  curl -i -X POST http://localhost:3000/api/upload/signature \
    -H "Content-Type: application/json" \
    -b /tmp/cookies.txt -c /tmp/cookies.txt \
    -d '{"filename":"test.png","contentType":"image/png","fileSize":1024}'
  ```

  Esperado: `200 OK` con JSON `{ signature, timestamp, apiKey, cloudName, folder, publicId, eager }`. La cookie `cart-session-id` se persiste en `/tmp/cookies.txt`.

  Probar invalid:
  ```bash
  curl -X POST http://localhost:3000/api/upload/signature \
    -H "Content-Type: application/json" \
    -d '{"contentType":"video/mp4","fileSize":100}'
  ```
  Esperado: `400` con `error: "Tipo de archivo no soportado..."`.

- [ ] **✋ Suggested commit checkpoint** — `feat(api): POST /api/upload/signature firma upload directo a Cloudinary`.

---

### Task B2: `POST /api/designs` (verify + persist)

**Files:**
- Create: `app/api/designs/route.js`

- [ ] **Step B2.1: Crear el archivo con POST y GET**

  ```javascript
  import { NextResponse } from "next/server";
  import { v2 as cloudinary } from "cloudinary";
  import connectMongo from "@/libs/mongoose";
  import Design from "@/models/Design";
  import { getOrCreateSession } from "@/libs/session";

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  export async function POST(req) {
    const sessionId = await getOrCreateSession();
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const required = ["cloudinaryPublicId", "originalFileUrl", "width", "height", "fileType", "fileSize"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // Anti-spoofing: verificar el publicId existe realmente en Cloudinary
    let resource;
    try {
      resource = await cloudinary.api.resource(body.cloudinaryPublicId);
    } catch {
      return NextResponse.json({ error: "Asset not found in Cloudinary" }, { status: 400 });
    }
    if (resource.width !== body.width || resource.height !== body.height) {
      return NextResponse.json({ error: "Asset dimensions mismatch" }, { status: 400 });
    }

    await connectMongo();
    const design = await Design.create({
      sessionId,
      name: body.name || "Sin título",
      cloudinaryPublicId: body.cloudinaryPublicId,
      cloudinaryFolder: "estampanda/temp",
      originalFileUrl: body.originalFileUrl,
      thumbnailUrl: body.thumbnailUrl,
      previewUrl: body.previewUrl,
      fileType: body.fileType.toLowerCase(),
      fileSize: body.fileSize,
      dimensions: { width: body.width, height: body.height },
      hasTransparency: !!body.hasTransparency,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return NextResponse.json({ design: design.toJSON() }, { status: 201 });
  }

  export async function GET(req) {
    const sessionId = await getOrCreateSession();
    await connectMongo();

    const url = new URL(req.url);
    const status = url.searchParams.get("status") ?? "active";

    const designs = await Design.find({ sessionId, status }).sort({ createdAt: -1 });

    return NextResponse.json({
      designs: designs.map((d) => d.toJSON()),
      total: designs.length,
    });
  }
  ```

- [ ] **Step B2.2: Verificación**

  Como aún no hay forma de subir directo a Cloudinary desde curl sin todo el setup, podemos probar con un publicId real generado a mano. Más fácil: skip por ahora, validar al final del flujo cuando frontend exista. Por ahora solo probar:

  ```bash
  curl -X GET http://localhost:3000/api/designs -b /tmp/cookies.txt
  ```
  Esperado: `{ designs: [], total: 0 }`.

- [ ] **✋ Suggested commit checkpoint** — `feat(api): POST/GET /api/designs registra y lista uploads`.

---

### Task B3: `PATCH` y `DELETE /api/designs/[id]`

**Files:**
- Create: `app/api/designs/[id]/route.js`

- [ ] **Step B3.1: Crear el archivo**

  ```javascript
  import { NextResponse } from "next/server";
  import { v2 as cloudinary } from "cloudinary";
  import connectMongo from "@/libs/mongoose";
  import Design from "@/models/Design";
  import Cart from "@/models/Cart";
  import { getOrCreateSession } from "@/libs/session";

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  export async function PATCH(req, { params }) {
    const { id } = await params;
    const sessionId = await getOrCreateSession();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    await connectMongo();
    const design = await Design.findById(id);
    if (!design || design.sessionId !== sessionId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (body.processedPublicId) {
      try {
        await cloudinary.api.resource(body.processedPublicId);
      } catch {
        return NextResponse.json({ error: "Processed asset not found" }, { status: 400 });
      }
      design.cloudinaryProcessedPublicId = body.processedPublicId;
      design.processedFileUrl = body.processedFileUrl;
      design.processingStatus.backgroundRemoved = !!body.backgroundRemoved;
    }

    await design.save();
    return NextResponse.json({ design: design.toJSON() });
  }

  export async function DELETE(req, { params }) {
    const { id } = await params;
    const sessionId = await getOrCreateSession();

    await connectMongo();
    const design = await Design.findById(id);
    if (!design || design.sessionId !== sessionId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const inCart = await Cart.exists({ "items.designId": design._id });
    if (inCart) {
      return NextResponse.json(
        { error: "Este diseño está en tu carrito. Quítalo primero." },
        { status: 409 }
      );
    }

    try {
      await cloudinary.uploader.destroy(design.cloudinaryPublicId);
      if (design.cloudinaryProcessedPublicId) {
        await cloudinary.uploader.destroy(design.cloudinaryProcessedPublicId);
      }
    } catch (e) {
      // Si Cloudinary falla, no borrar el doc — el cron lo limpiará
      return NextResponse.json({ error: "Cloudinary delete failed", details: e.message }, { status: 500 });
    }

    await Design.deleteOne({ _id: design._id });
    return NextResponse.json({ success: true });
  }
  ```

- [ ] **Step B3.2: Verificación**

  Sin Design existente aún, no se puede probar. Marcar para validación end-to-end al integrar frontend (Fase C).

- [ ] **✋ Suggested commit checkpoint** — `feat(api): PATCH/DELETE /api/designs/[id]`.

---

### Task B4: `GET /api/cart`

**Files:**
- Create: `app/api/cart/route.js`

- [ ] **Step B4.1: Crear el archivo**

  ```javascript
  import { NextResponse } from "next/server";
  import connectMongo from "@/libs/mongoose";
  import Cart from "@/models/Cart";
  import Design from "@/models/Design";
  import { getOrCreateSession } from "@/libs/session";

  /**
   * Hidrata items con su Design completo.
   */
  async function hydrateCart(cart) {
    const json = cart.toJSON();
    const designIds = cart.items.map((i) => i.designId);
    const designs = await Design.find({ _id: { $in: designIds } });
    const byId = new Map(designs.map((d) => [String(d._id), d.toJSON()]));
    json.items = json.items.map((item) => ({
      ...item,
      design: byId.get(String(item.designId)) ?? null,
    }));
    return json;
  }

  export async function GET() {
    const sessionId = await getOrCreateSession();
    await connectMongo();

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    } else {
      // touch expiresAt
      await cart.save();
    }

    return NextResponse.json({ cart: await hydrateCart(cart) });
  }
  ```

- [ ] **Step B4.2: Verificación con curl**

  ```bash
  curl -X GET http://localhost:3000/api/cart -b /tmp/cookies.txt -c /tmp/cookies.txt
  ```

  Esperado: `{ cart: { id, sessionId, items: [], subtotal: 0, expiresAt: <fecha+24h> } }`.

- [ ] **✋ Suggested commit checkpoint** — `feat(api): GET /api/cart con hidratación de items`.

---

### Task B5: `POST /api/cart/items`

**Files:**
- Create: `app/api/cart/items/route.js`

- [ ] **Step B5.1: Crear el archivo**

  ```javascript
  import { NextResponse } from "next/server";
  import connectMongo from "@/libs/mongoose";
  import Cart from "@/models/Cart";
  import Design from "@/models/Design";
  import { getOrCreateSession } from "@/libs/session";
  import { checkRateLimit } from "@/libs/rate-limit";
  import { calculateUnitPrice, calculateTotalPrice } from "@/libs/pricing";

  // Catálogos: deben estar sincronizados con MaterialSelector.js / CutTypeSelector.js
  const MATERIALS = {
    matte: { name: "Mate", priceMultiplier: 1 },
    glossy: { name: "Brillante", priceMultiplier: 1.1 },
    transparent: { name: "Transparente", priceMultiplier: 1.3 },
    holographic: { name: "Holográfico", priceMultiplier: 1.5 },
    glow: { name: "Glow in Dark", priceMultiplier: 1.8 },
    metallic: { name: "Metálico", priceMultiplier: 2 },
  };
  const CUT_TYPES = {
    square: { name: "Cuadrado", priceMultiplier: 1 },
    round: { name: "Redondo", priceMultiplier: 1.1 },
    oval: { name: "Ovalado", priceMultiplier: 1.15 },
    diecut: { name: "Troquelado", priceMultiplier: 1.3 },
    custom: { name: "Personalizado", priceMultiplier: 1.5 },
  };

  function calculateDpi(designWidthPx, sizeWidthCm) {
    return Math.round((designWidthPx / sizeWidthCm) * 2.54);
  }

  export async function POST(req) {
    const sessionId = await getOrCreateSession();
    const rl = checkRateLimit(`cart:${sessionId}`, 100, 3600);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { designId, material, size, cutType, quantity } = body;

    if (!designId || !material?.id || !size?.width || !size?.height || !cutType?.id || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const matSpec = MATERIALS[material.id];
    const cutSpec = CUT_TYPES[cutType.id];
    if (!matSpec || !cutSpec) {
      return NextResponse.json({ error: "Material o tipo de corte inválido" }, { status: 400 });
    }

    await connectMongo();
    const design = await Design.findOne({ _id: designId, sessionId });
    if (!design) {
      return NextResponse.json({ error: "Design no encontrado en tu sesión" }, { status: 404 });
    }

    const matSnapshot = { id: material.id, name: matSpec.name, priceMultiplier: matSpec.priceMultiplier };
    const cutSnapshot = { id: cutType.id, name: cutSpec.name, priceMultiplier: cutSpec.priceMultiplier };
    const sizeSnapshot = {
      width: Number(size.width),
      height: Number(size.height),
      label: size.label,
      custom: !!size.custom,
    };

    const unitPrice = calculateUnitPrice({
      size: sizeSnapshot,
      material: matSnapshot,
      cutType: cutSnapshot,
      quantity: Number(quantity),
    });
    const totalPrice = calculateTotalPrice({
      size: sizeSnapshot,
      material: matSnapshot,
      cutType: cutSnapshot,
      quantity: Number(quantity),
    });
    const dpi = calculateDpi(design.dimensions.width, sizeSnapshot.width);

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }

    cart.items.push({
      designId: design._id,
      material: matSnapshot,
      size: sizeSnapshot,
      cutType: cutSnapshot,
      quantity: Number(quantity),
      unitPrice,
      totalPrice,
      dpi,
      dpiWarning: dpi < 300,
      addedAt: new Date(),
      updatedAt: new Date(),
    });
    await cart.save();

    return NextResponse.json({ cart: cart.toJSON() }, { status: 201 });
  }
  ```

  > **Nota:** la respuesta NO viene hidratada con `design` populado. El frontend (vía SWR `mutate()`) hará `GET /api/cart` después de cada `addItem` y obtendrá el carrito completo con designs. Es el patrón más simple para MVP.

- [ ] **Step B5.2: Verificación**

  Necesita un Design real. Marcar para validación end-to-end en Fase C.

- [ ] **✋ Suggested commit checkpoint** — `feat(api): POST /api/cart/items con cálculo de precio + DPI`.

---

### Task B6: `PATCH` y `DELETE /api/cart/items/[itemId]`

**Files:**
- Create: `app/api/cart/items/[itemId]/route.js`

- [ ] **Step B6.1: Crear el archivo**

  ```javascript
  import { NextResponse } from "next/server";
  import connectMongo from "@/libs/mongoose";
  import Cart from "@/models/Cart";
  import Design from "@/models/Design";
  import { getOrCreateSession } from "@/libs/session";
  import { calculateUnitPrice, calculateTotalPrice } from "@/libs/pricing";

  // Catálogos: duplicación temporal hasta extraer a libs/catalog.js (TODO post-MVP)
  const MATERIALS = {
    matte: { name: "Mate", priceMultiplier: 1 },
    glossy: { name: "Brillante", priceMultiplier: 1.1 },
    transparent: { name: "Transparente", priceMultiplier: 1.3 },
    holographic: { name: "Holográfico", priceMultiplier: 1.5 },
    glow: { name: "Glow in Dark", priceMultiplier: 1.8 },
    metallic: { name: "Metálico", priceMultiplier: 2 },
  };
  const CUT_TYPES = {
    square: { name: "Cuadrado", priceMultiplier: 1 },
    round: { name: "Redondo", priceMultiplier: 1.1 },
    oval: { name: "Ovalado", priceMultiplier: 1.15 },
    diecut: { name: "Troquelado", priceMultiplier: 1.3 },
    custom: { name: "Personalizado", priceMultiplier: 1.5 },
  };

  function calculateDpi(widthPx, widthCm) {
    return Math.round((widthPx / widthCm) * 2.54);
  }

  export async function PATCH(req, { params }) {
    const { itemId } = await params;
    const sessionId = await getOrCreateSession();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    await connectMongo();
    const cart = await Cart.findOne({ sessionId });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = cart.items.id(itemId);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    // Aplicar patch a la config
    if (body.material?.id) {
      const m = MATERIALS[body.material.id];
      if (!m) return NextResponse.json({ error: "Material inválido" }, { status: 400 });
      item.material = { id: body.material.id, name: m.name, priceMultiplier: m.priceMultiplier };
    }
    if (body.cutType?.id) {
      const c = CUT_TYPES[body.cutType.id];
      if (!c) return NextResponse.json({ error: "Tipo de corte inválido" }, { status: 400 });
      item.cutType = { id: body.cutType.id, name: c.name, priceMultiplier: c.priceMultiplier };
    }
    if (body.size?.width || body.size?.height) {
      item.size = {
        width: Number(body.size.width ?? item.size.width),
        height: Number(body.size.height ?? item.size.height),
        label: body.size.label ?? item.size.label,
        custom: body.size.custom ?? item.size.custom,
      };
    }
    if (body.quantity !== undefined) {
      const q = Number(body.quantity);
      if (q < 1) return NextResponse.json({ error: "Cantidad mínima: 1" }, { status: 400 });
      item.quantity = q;
    }

    // Recalcular precio + DPI
    item.unitPrice = calculateUnitPrice({
      size: item.size,
      material: item.material,
      cutType: item.cutType,
      quantity: item.quantity,
    });
    item.totalPrice = calculateTotalPrice({
      size: item.size,
      material: item.material,
      cutType: item.cutType,
      quantity: item.quantity,
    });

    const design = await Design.findById(item.designId);
    if (design) {
      item.dpi = calculateDpi(design.dimensions.width, item.size.width);
      item.dpiWarning = item.dpi < 300;
    }
    item.updatedAt = new Date();

    await cart.save();
    return NextResponse.json({ cart: cart.toJSON() });
  }

  export async function DELETE(req, { params }) {
    const { itemId } = await params;
    const sessionId = await getOrCreateSession();

    await connectMongo();
    const cart = await Cart.findOne({ sessionId });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = cart.items.id(itemId);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    cart.items.pull(itemId);
    await cart.save();
    return NextResponse.json({ cart: cart.toJSON() });
  }
  ```

  > **TODO post-MVP:** extraer `MATERIALS` y `CUT_TYPES` a `libs/catalog.js` para evitar duplicación entre `app/api/cart/items/route.js` y `app/api/cart/items/[itemId]/route.js`. Marcar con comentario.

- [ ] **Step B6.2: Verificación end-to-end al final de Fase C**

- [ ] **✋ Suggested commit checkpoint** — `feat(api): PATCH/DELETE /api/cart/items/[itemId]`.

---

### Task B7: Borrar endpoints legacy

**Files:**
- Delete: `app/api/upload/route.js`
- Delete: `app/api/upload/design/route.js`
- Delete: `app/api/test-cloudinary/route.js`

- [ ] **Step B7.1: Buscar callers**

  ```bash
  grep -rn "/api/upload" --include="*.js" --include="*.jsx" app/ components/ libs/ | grep -v node_modules
  grep -rn "/api/test-cloudinary" --include="*.js" --include="*.jsx" app/ components/ libs/ | grep -v node_modules
  ```

  Esperado: encontrar referencia en `components/stickers/FileUploader.js` (`/api/upload/design`). Esa la actualizamos en Fase C, así que **NO borrar todavía** los endpoints — esperar a Fase C step C2.x antes de borrar.

- [ ] **Step B7.2 (deferred):** marcar en una nota TODO que estos archivos se borran en step E5.x. **Saltar este task hasta Fase E.**

---

## Fase C — Frontend upload + carrito (~2-3 días)

Producir: el flujo end-to-end funcional en browser.

### Task C1: Helper cliente para signed direct upload

**Files:**
- Create: `libs/cloudinary-client.js`

- [ ] **Step C1.1: Crear `libs/cloudinary-client.js`**

  ```javascript
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
  ```

- [ ] **✋ Suggested commit checkpoint** — `feat(client): wrapper signed direct upload a Cloudinary`.

---

### Task C2: Refactor `FileUploader.js`

**Files:**
- Modify: `components/stickers/FileUploader.js`

- [ ] **Step C2.1: Reemplazar el `onDrop` y limpiar imports**

  En `components/stickers/FileUploader.js`:

  - Reemplazar la lógica del `onDrop` por:

  ```javascript
  import { uploadDesignToCloudinary } from "@/libs/cloudinary-client";

  // ... dentro del componente:
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setError("");

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        setError("El archivo es muy grande. Máximo 50 MB.");
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setError("Formato no válido. Usa JPG, PNG, SVG o WebP.");
      } else {
        setError("Error al subir el archivo. Intenta de nuevo.");
      }
      return;
    }
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const design = await uploadDesignToCloudinary(selectedFile, setUploadProgress);
      setIsUploading(false);
      setUploadProgress(100);

      // Usar thumbnail de Cloudinary directamente, sin FileReader
      setPreview(design.thumbnailUrl || design.originalFileUrl);

      if (onFileUpload) {
        onFileUpload({
          designId: design.id,
          file: selectedFile,
          preview: design.thumbnailUrl || design.originalFileUrl,
          url: design.previewUrl,
          originalUrl: design.originalFileUrl,
          thumbnailUrl: design.thumbnailUrl,
          previewUrl: design.previewUrl,
          name: design.name,
          size: selectedFile.size,
          type: selectedFile.type,
          dimensions: design.dimensions,
          hasTransparency: design.hasTransparency,
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Error al subir el archivo. Intenta de nuevo.");
      setIsUploading(false);
      setFile(null);
      setPreview(null);
      setUploadProgress(0);
    }
  }, [onFileUpload]);
  ```

  - Quitar el bloque de `FileReader` y `XMLHttpRequest` original
  - Quitar la importación que ya no se usa

- [ ] **Step C2.2: Verificación manual**

  Iniciar `npm run dev`, ir a `/stickers/designer`, arrastrar una imagen pequeña.

  Esperado:
  - Upload progress se actualiza
  - Después aparece el thumbnail de Cloudinary
  - Network tab muestra: 1 POST a `/api/upload/signature`, 1 POST a `api.cloudinary.com`, 1 POST a `/api/designs`
  - El error de "auth blocked" antes presente, ya no ocurre

- [ ] **Step C2.3: Borrar endpoints legacy**

  Verificar primero que nada los usa:
  ```bash
  grep -rn "/api/upload/design\|/api/test-cloudinary" --include="*.js" --include="*.jsx" app/ components/ libs/ | grep -v node_modules
  ```

  Si grep está limpio:
  ```bash
  rm app/api/upload/route.js
  rm -rf app/api/upload/design
  rm -rf app/api/test-cloudinary
  ```

- [ ] **✋ Suggested commit checkpoint** — `refactor(uploader): usar signed direct upload, eliminar endpoints base64 legacy`.

---

### Task C3: Hook `useCart` con SWR

**Files:**
- Create: `libs/use-cart.js`

- [ ] **Step C3.1: Crear el hook**

  ```javascript
  "use client";
  import useSWR from "swr";

  const fetcher = (url) =>
    fetch(url).then(async (r) => {
      if (!r.ok) throw new Error("Cart fetch failed");
      return r.json();
    });

  export function useCart() {
    const { data, mutate, isLoading, error } = useSWR("/api/cart", fetcher, {
      revalidateOnFocus: true,
    });

    const cart = data?.cart;
    const items = cart?.items ?? [];
    const subtotal = cart?.subtotal ?? 0;

    const addItem = async (item) => {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Add failed");
      mutate();
    };

    const updateItem = async (itemId, patch) => {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      mutate();
    };

    const removeItem = async (itemId) => {
      const res = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Remove failed");
      mutate();
    };

    return { cart, items, subtotal, isLoading, error, addItem, updateItem, removeItem, mutate };
  }
  ```

- [ ] **✋ Suggested commit checkpoint** — `feat(cart): hook useCart con SWR`.

---

### Task C4: Componentes del carrito

**Files:**
- Create: `components/cart/CartBadge.js`
- Create: `components/cart/CartItemCard.js`
- Create: `components/cart/CartDrawer.js`
- Create: `app/cart/page.js`

- [ ] **Step C4.1: `CartBadge.js`**

  ```javascript
  "use client";
  import Link from "next/link";
  import { useCart } from "@/libs/use-cart";
  import { ShoppingBagIcon } from "@heroicons/react/24/outline";

  export default function CartBadge() {
    const { items, isLoading } = useCart();
    const count = items.reduce((s, i) => s + i.quantity, 0);

    return (
      <Link href="/cart" className="relative flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
        <ShoppingBagIcon className="w-6 h-6" />
        {!isLoading && count > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#275D5C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    );
  }
  ```

- [ ] **Step C4.2: `CartItemCard.js`**

  ```javascript
  "use client";
  import { useState } from "react";
  import Image from "next/image";
  import { TrashIcon } from "@heroicons/react/24/outline";
  import { useCart } from "@/libs/use-cart";

  const MATERIALS = ["matte","glossy","transparent","holographic","glow","metallic"];
  const CUT_TYPES = ["square","round","oval","diecut","custom"];

  export default function CartItemCard({ item }) {
    const { updateItem, removeItem } = useCart();
    const [busy, setBusy] = useState(false);
    const design = item.design;

    const change = async (patch) => {
      setBusy(true);
      try {
        await updateItem(item._id, patch);
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          {design?.thumbnailUrl ? (
            <Image src={design.thumbnailUrl} alt={design.name} fill className="object-contain p-1" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">?</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{design?.name || "Diseño eliminado"}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <select value={item.material.id} onChange={(e) => change({ material: { id: e.target.value } })} disabled={busy} className="border rounded px-2 py-1">
              {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={item.cutType.id} onChange={(e) => change({ cutType: { id: e.target.value } })} disabled={busy} className="border rounded px-2 py-1">
              {CUT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="col-span-2 text-xs text-gray-500">
              {item.size.width}×{item.size.height} cm — DPI {item.dpi ?? "?"}
              {item.dpiWarning && <span className="text-amber-600 ml-1">⚠ baja resolución</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => change({ quantity: Math.max(1, item.quantity - 1) })} disabled={busy || item.quantity <= 1} className="border rounded w-7 h-7">−</button>
              <span className="w-10 text-center">{item.quantity}</span>
              <button onClick={() => change({ quantity: item.quantity + 1 })} disabled={busy} className="border rounded w-7 h-7">+</button>
            </div>
            <p className="text-right font-bold text-[#275D5C]">${item.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <button onClick={() => removeItem(item._id)} disabled={busy} className="self-start p-2 text-gray-400 hover:text-red-500">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }
  ```

  > **Nota UX**: el ítem usa selects nativos por simplicidad. Los selectores ricos (`MaterialSelector`, `CutTypeSelector`, `SizeSelector`) podrían reusarse en una iteración posterior con un modal "Editar item".

- [ ] **Step C4.3: `CartDrawer.js`**

  ```javascript
  "use client";
  import Link from "next/link";
  import { useCart } from "@/libs/use-cart";
  import CartItemCard from "./CartItemCard";

  export default function CartDrawer() {
    const { items, subtotal, isLoading } = useCart();

    if (isLoading) return <div className="p-6 text-center">Cargando carrito…</div>;

    if (items.length === 0) {
      return (
        <div className="p-6 text-center">
          <p className="text-lg text-gray-600 mb-4">Tu carrito está vacío</p>
          <Link href="/stickers/designer" className="px-6 py-3 bg-[#275D5C] text-white rounded-lg">
            Diseña tu primer sticker
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        {items.map((item) => <CartItemCard key={item._id} item={item} />)}

        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">Subtotal</span>
            <span className="text-2xl font-bold text-[#275D5C]">${subtotal.toFixed(2)} MXN</span>
          </div>
          <Link
            href="/stickers/checkout"
            className="block w-full text-center px-6 py-3 sm:px-8 sm:py-4 bg-[#275D5C] text-white rounded-lg font-semibold"
          >
            Continuar a pago
          </Link>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step C4.4: `app/cart/page.js`**

  ```javascript
  import CartDrawer from "@/components/cart/CartDrawer";

  export const metadata = { title: "Tu carrito - Estampanda" };

  export default function CartPage() {
    return (
      <main className="max-w-3xl mx-auto pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-8">Tu carrito</h1>
        <CartDrawer />
      </main>
    );
  }
  ```

- [ ] **Step C4.5: Añadir `<CartBadge />` al `Header.js`**

  Buscar dónde están los nav items en `components/Header.js` y añadir `<CartBadge />` al lado del botón "Contacto" o equivalente. Importarlo:

  ```javascript
  import CartBadge from "@/components/cart/CartBadge";
  // ...
  <CartBadge />
  ```

- [ ] **Step C4.6: Verificación manual**

  Ir a `/cart` → debe mostrar carrito vacío con CTA. Después en Step C5 cuando el botón "Añadir al carrito" funcione, verificar que el badge actualiza el contador.

- [ ] **✋ Suggested commit checkpoint** — `feat(cart): UI básica de carrito (drawer, item card, badge, /cart page)`.

---

### Task C5: Refactor `DesignPreview.js` y orquestación

**Files:**
- Modify: `components/stickers/DesignPreview.js`
- Modify: `app/stickers/designer/page.js`

- [ ] **Step C5.1: Simplificar `DesignPreview.js`**

  Cambios:
  - Quitar `mockupViews` array y los botones de cambio de vista
  - Quitar `previewMode` state y todo `if (previewMode === ...)`
  - Mantener `getMaterialEffect` y `getCutPath`
  - Añadir prop `onAddToCart`
  - Añadir DPI badge calculado

  Estructura nueva (esquemática):

  ```javascript
  "use client";
  import { useMemo } from "react";
  import { motion } from "framer-motion";

  export default function DesignPreview({
    designFile, material, size, cutType, quantity, unitPrice, totalPrice, onAddToCart
  }) {
    const dpi = useMemo(() => {
      if (!designFile?.dimensions || !size?.width) return null;
      return Math.round((designFile.dimensions.width / size.width) * 2.54);
    }, [designFile, size]);

    const dpiStatus = useMemo(() => {
      if (dpi === null) return null;
      if (dpi >= 300) return { color: "green", label: `${dpi} DPI · Excelente` };
      if (dpi >= 200) return { color: "amber", label: `${dpi} DPI · Aceptable` };
      return { color: "red", label: `${dpi} DPI · Puede pixelarse` };
    }, [dpi]);

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Vista Previa</h2>

        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
          {designFile?.preview && (
            <div
              style={{
                clipPath: getCutPath(cutType),
                width: "70%",
                height: "70%",
                background: `url(${designFile.preview}) center/contain no-repeat`,
                ...getMaterialEffect(material),
              }}
            />
          )}

          {dpiStatus && (
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-${dpiStatus.color}-100 text-${dpiStatus.color}-800`}>
              {dpiStatus.label}
            </div>
          )}

          {size && (
            <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-gray-600">
              ← {size.width} cm × {size.height} cm →
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex justify-between text-lg">
            <span>Total:</span>
            <span className="font-bold text-[#275D5C]">${totalPrice?.toFixed(2) ?? "0.00"} MXN</span>
          </div>
          <button
            onClick={onAddToCart}
            disabled={!designFile || !material || !size || !cutType}
            className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-[#275D5C] hover:bg-[#3B7F7E] disabled:bg-gray-300 text-white rounded-lg font-semibold"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    );
  }

  function getCutPath(cutType) {
    if (!cutType) return "none";
    const paths = {
      square: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      round: "circle(50%)",
      oval: "ellipse(50% 40%)",
      diecut: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)",
      custom: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    };
    return paths[cutType.id] || "none";
  }

  function getMaterialEffect(material) {
    if (!material) return {};
    const effects = {
      matte: { filter: "saturate(0.9)" },
      glossy: { filter: "saturate(1.2) brightness(1.1)" },
      transparent: { opacity: 0.9 },
      holographic: { filter: "saturate(1.3) hue-rotate(15deg)", mixBlendMode: "overlay" },
      glow: { filter: "brightness(1.2) contrast(1.1)" },
      metallic: { filter: "contrast(1.2) brightness(1.05)" },
    };
    return effects[material.id] || {};
  }
  ```

- [ ] **Step C5.2: Modificar `app/stickers/designer/page.js`** para wirear el flujo

  El page debe:
  1. Tener estado `{ design, material, size, cutType, quantity }`
  2. Renderizar `<FileUploader onFileUpload={setDesign} />`
  3. Cuando hay design, renderizar selectores + `<DesignPreview ... onAddToCart={handleAdd} />`
  4. `handleAdd` llama `useCart().addItem({ designId: design.designId, material: { id: material.id }, ... })`
  5. Después del add, mostrar toast con react-hot-toast y opciones "Añadir otro" / "Ir al carrito"

  Esquema:

  ```javascript
  "use client";
  import { useState } from "react";
  import toast from "react-hot-toast";
  import FileUploader from "@/components/stickers/FileUploader";
  import MaterialSelector from "@/components/stickers/MaterialSelector";
  import SizeSelector from "@/components/stickers/SizeSelector";
  import CutTypeSelector from "@/components/stickers/CutTypeSelector";
  import DesignPreview from "@/components/stickers/DesignPreview";
  import { useCart } from "@/libs/use-cart";
  import { calculateUnitPrice, calculateTotalPrice } from "@/libs/pricing";

  export default function StickerDesignerPage() {
    const [design, setDesign] = useState(null);
    const [material, setMaterial] = useState(null);
    const [size, setSize] = useState({ width: 5, height: 5, label: "Estándar" });
    const [cutType, setCutType] = useState(null);
    const [quantity, setQuantity] = useState(50);
    const { addItem } = useCart();

    const canAdd = design && material && size && cutType && quantity > 0;

    const unitPrice = canAdd ? calculateUnitPrice({ size, material, cutType, quantity }) : 0;
    const totalPrice = canAdd ? calculateTotalPrice({ size, material, cutType, quantity }) : 0;

    const handleAdd = async () => {
      if (!canAdd) return;
      try {
        await addItem({
          designId: design.designId,
          material: { id: material.id },
          size: { width: size.width, height: size.height, label: size.label, custom: !!size.custom },
          cutType: { id: cutType.id },
          quantity,
        });
        toast.success("Añadido al carrito");
      } catch (e) {
        toast.error(e.message || "No se pudo añadir");
      }
    };

    return (
      <main className="max-w-6xl mx-auto pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24 px-4 space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800">Diseña tu sticker</h1>

        {!design ? (
          <FileUploader onFileUpload={setDesign} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <div className="lg:sticky lg:top-24 self-start">
              <DesignPreview
                designFile={design}
                material={material}
                size={size}
                cutType={cutType}
                quantity={quantity}
                unitPrice={unitPrice}
                totalPrice={totalPrice}
                onAddToCart={handleAdd}
              />
            </div>
            <div className="space-y-6">
              <MaterialSelector selectedMaterial={material} onMaterialChange={setMaterial} />
              <SizeSelector selectedSize={size} onSizeChange={setSize} />
              <CutTypeSelector selectedCutType={cutType} onCutTypeChange={setCutType} />
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <label className="block text-sm font-semibold mb-2">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }
  ```

- [ ] **Step C5.3: Verificación end-to-end manual**

  1. `npm run dev`, ir a `/stickers/designer`
  2. Subir un PNG → ver thumbnail de Cloudinary
  3. Elegir material, tamaño, corte, cantidad
  4. Ver precio + DPI badge
  5. Click "Añadir al carrito" → toast de éxito
  6. Click en CartBadge → ir a `/cart`
  7. Ver el item, cambiar cantidad → precio se actualiza
  8. Cambiar material en select → precio se actualiza
  9. Borrar item → carrito vacío
  10. Volver a `/stickers/designer`, subir otro diseño, añadir → ver que se acumula en el carrito

- [ ] **✋ Suggested commit checkpoint** — `feat(designer): flujo end-to-end de upload + configurar + añadir al carrito`.

---

## Fase D — Background removal (~1-2 días)

### Task D1: Wrapper de @imgly + configuración Webpack

**Files:**
- Create: `libs/background-removal.js`
- Modify: `next.config.js`

- [ ] **Step D1.1: Crear `libs/background-removal.js`**

  ```javascript
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
      // SIMD support check
      return WebAssembly.validate(new Uint8Array([
        0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11
      ]));
    } catch { return false; }
  }
  ```

- [ ] **Step D1.2: Modificar `next.config.js`** para soporte WASM

  Leer el archivo actual primero, después añadir:

  ```javascript
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  async headers() {
    return [{
      source: "/_next/static/wasm/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
  ```

  Si ya hay `webpack` u `headers`, mergear cuidadosamente.

- [ ] **✋ Suggested commit checkpoint** — `feat(bg-removal): wrapper lazy de @imgly + config webpack`.

---

### Task D2: Botón "Quitar fondo" en `DesignPreview`

**Files:**
- Modify: `components/stickers/DesignPreview.js`

- [ ] **Step D2.1: Añadir el botón y su estado**

  Dentro de `DesignPreview.js`, añadir:

  ```javascript
  import { useState } from "react";
  import { removeBackgroundFromUrl, isBackgroundRemovalSupported } from "@/libs/background-removal";
  import { uploadProcessedToCloudinary } from "@/libs/cloudinary-client";

  // ... dentro del componente, recibir prop adicional onProcessed:
  function BackgroundRemovalButton({ design, onProcessed }) {
    const [state, setState] = useState("idle"); // idle | loading | uploading | done | error
    const [percent, setPercent] = useState(0);
    const [phase, setPhase] = useState("");

    if (!isBackgroundRemovalSupported()) return null; // navegador sin WASM SIMD

    const handleClick = async () => {
      setState("loading");
      try {
        setPhase("Preparando herramienta…");
        const blob = await removeBackgroundFromUrl(design.originalUrl, (key, pct) => {
          setPercent(pct);
          if (key.startsWith("fetch:")) setPhase("Descargando IA…");
          else if (key.startsWith("compute:")) setPhase("Quitando fondo…");
        });

        setState("uploading");
        setPhase("Guardando resultado…");
        const { publicId, url } = await uploadProcessedToCloudinary(blob, design.name || "sticker");

        // Notificar al server
        const res = await fetch(`/api/designs/${design.designId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            processedFileUrl: url,
            processedPublicId: publicId,
            backgroundRemoved: true,
          }),
        });
        if (!res.ok) throw new Error("Failed to save processed");
        const data = await res.json();

        setState("done");
        onProcessed?.({ ...data.design, preview: url });
      } catch (e) {
        console.error(e);
        setState("error");
      }
    };

    if (state === "idle") {
      return (
        <button
          onClick={handleClick}
          className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-white border-2 border-[#275D5C] text-[#275D5C] rounded-lg font-semibold hover:bg-[#F5E6D3]/30"
        >
          ✨ Quitar fondo
        </button>
      );
    }
    if (state === "error") {
      return <p className="text-sm text-red-600">No pudimos procesar. Intenta con un PNG transparente.</p>;
    }
    return (
      <div className="text-center py-4">
        <p className="text-sm font-semibold text-gray-700">{phase} {percent > 0 ? `${percent}%` : ""}</p>
        <p className="text-xs text-gray-500 mt-1">🔒 Tu imagen no sale de tu navegador</p>
      </div>
    );
  }

  // En el JSX del componente principal, añadir antes del botón "Añadir al carrito":
  <BackgroundRemovalButton design={designFile} onProcessed={onProcessed} />
  ```

- [ ] **Step D2.2: Pasar `onProcessed` desde `app/stickers/designer/page.js`**

  En el page, modificar:
  ```javascript
  <DesignPreview
    ...
    onProcessed={(updated) => setDesign({ ...design, ...updated })}
  />
  ```

- [ ] **Step D2.3: Verificación manual**

  1. Subir un PNG con fondo blanco
  2. Click en "Quitar fondo"
  3. Ver "Preparando herramienta…" → "Descargando IA…" (1ª vez, ~10s)
  4. Ver "Quitando fondo…" con %
  5. Ver "Guardando resultado…"
  6. Preview se actualiza con la versión sin fondo
  7. Recargar la página → estado se pierde (esperado, fix futuro: persistir processedFileUrl al state global)
  8. 2ª vez con otra imagen, modelo cacheado → "Preparando" instantáneo

- [ ] **✋ Suggested commit checkpoint** — `feat(bg-removal): botón "Quitar fondo" en preview con upload del resultado`.

---

## Fase E — Cron + producción + cleanup final (~1 día)

### Task E1: Cron de limpieza

**Files:**
- Create: `app/api/cron/cleanup-expired/route.js`
- Modify: `vercel.json`

- [ ] **Step E1.1: Crear el endpoint del cron**

  ```javascript
  import { NextResponse } from "next/server";
  import { v2 as cloudinary } from "cloudinary";
  import connectMongo from "@/libs/mongoose";
  import Cart from "@/models/Cart";
  import Design from "@/models/Design";
  import Order from "@/models/Order";

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  export const maxDuration = 60;

  export async function GET(req) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const now = new Date();
    const stats = {
      cartsDeleted: 0,
      designsDeleted: 0,
      designsExtended: 0,
      cloudinaryDeleted: 0,
      cloudinaryFailed: 0,
      errors: [],
    };

    // 1. Borrar carritos expirados
    const expiredCarts = await Cart.find({ expiresAt: { $lt: now } });
    if (expiredCarts.length > 0) {
      await Cart.deleteMany({ _id: { $in: expiredCarts.map((c) => c._id) } });
      stats.cartsDeleted = expiredCarts.length;
    }

    // 2. Limpiar Designs expirados huérfanos
    const expiredDesigns = await Design.find({ expiresAt: { $lt: now }, status: "active" });

    for (const design of expiredDesigns) {
      const inCart = await Cart.exists({ "items.designId": design._id });
      const inOrder = await Order.exists({ designUrl: design.originalFileUrl });

      if (inCart || inOrder) {
        design.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        await design.save();
        stats.designsExtended++;
        continue;
      }

      try {
        await cloudinary.uploader.destroy(design.cloudinaryPublicId);
        if (design.cloudinaryProcessedPublicId) {
          await cloudinary.uploader.destroy(design.cloudinaryProcessedPublicId);
        }
        stats.cloudinaryDeleted++;
      } catch (e) {
        stats.cloudinaryFailed++;
        stats.errors.push({ publicId: design.cloudinaryPublicId, error: e.message });
        continue;
      }

      await Design.deleteOne({ _id: design._id });
      stats.designsDeleted++;
    }

    return NextResponse.json({ ok: true, stats, runAt: now.toISOString() });
  }
  ```

- [ ] **Step E1.2: Modificar `vercel.json`** para añadir el cron

  Leer el archivo, fusionar con:

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

- [ ] **Step E1.3: Verificación local con `curl`**

  ```bash
  # 1. Crear un Design con expiresAt en el pasado
  node -e "
  require('dotenv').config({ path: '.env.local' });
  (async () => {
    await import('./libs/mongoose.js').then(m => m.default());
    const Design = (await import('./models/Design.js')).default;
    const d = await Design.create({
      sessionId: 'test-cron',
      name: 'expirado',
      cloudinaryPublicId: 'estampanda/temp/test-cron/' + Date.now(),
      originalFileUrl: 'https://x',
      fileType: 'png',
      fileSize: 1,
      dimensions: { width: 1, height: 1 },
      expiresAt: new Date(Date.now() - 1000),
    });
    console.log('Created expired:', d._id);
    process.exit(0);
  })();
  "

  # 2. Llamar al cron
  curl -i -H "Authorization: Bearer $(grep CRON_SECRET .env.local | cut -d= -f2)" \
    http://localhost:3000/api/cron/cleanup-expired
  ```

  Esperado: respuesta `{ ok: true, stats: { ..., cloudinaryFailed: 1 (porque el publicId es fake) ... } }`. El doc se mantiene en Mongo (porque Cloudinary "falló") — comportamiento correcto. Para test exhaustivo, usar publicId real (subir desde browser primero).

- [ ] **Step E1.4: Probar 401**

  ```bash
  curl -i http://localhost:3000/api/cron/cleanup-expired
  ```
  Esperado: `401 Unauthorized`.

- [ ] **✋ Suggested commit checkpoint** — `feat(cron): limpieza diaria de carts y designs expirados`.

---

### Task E2: Limpiar `libs/cloudinary.js`

**Files:**
- Modify: `libs/cloudinary.js`

- [ ] **Step E2.1: Buscar callers de funciones a borrar**

  ```bash
  grep -rn "uploadToCloudinary\|applyMockup\|generateStickerSheet\|removeBackground" --include="*.js" --include="*.jsx" app/ components/ libs/ models/ | grep -v node_modules
  ```

  Si hay matches en archivos que ya borramos en C2.3 → ignorar. Si hay matches en archivos vivos → arreglar antes de borrar las funciones.

- [ ] **Step E2.2: Editar `libs/cloudinary.js`** — eliminar las funciones marcadas

  Borrar de `libs/cloudinary.js`:
  - función `uploadToCloudinary` (la genérica al inicio)
  - función `applyMockup`
  - función `generateStickerSheet`
  - función `removeBackground` (server-side)

  Renombrar `uploadStickerDesign` → `uploadProcessedFromServer` y comentar `// reservada para uso server-side opcional, no se usa en el flujo de cliente actual`. **O** eliminar también si no la usa nadie (verificar con grep).

  Mantener:
  - `cloudinary.config(...)`
  - `deleteFromCloudinary` (usado por cron — opcional reusar)
  - `optimizeForPrint` con comentario `// TODO: usar en sub-proyecto futuro de proof admin`

- [ ] **✋ Suggested commit checkpoint** — `chore(cloudinary): eliminar funciones legacy no usadas`.

---

### Task E3: Limpiar `.env.example` y `config.js`

**Files:**
- Modify: `.env.example`
- Modify: `config.js`

- [ ] **Step E3.1: Editar `.env.example`** — quitar variables no usadas

  Borrar las secciones de:
  - Google OAuth
  - Resend
  - Twilio
  - Shippo
  - Remove.bg
  - Hotjar (si no se usa)

  Confirmar que quedan solo:
  - Admin auth (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
  - JWT (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
  - MongoDB
  - Stripe
  - Cloudinary
  - **CRON_SECRET** (placeholder)
  - Otras vars de Estampanda (`PRODUCTION_MODE`, `ENABLE_RUSH_ORDERS`, `MAX_FILE_SIZE_MB`)

- [ ] **Step E3.2: Editar `config.js`** — quitar bloques `resend` y `aws`

  Eliminar:
  ```javascript
  resend: { ... },
  aws: { ... },
  ```

  Si algún archivo lo importa: corregir o eliminar referencia.

  ```bash
  grep -rn "config\.resend\|config\.aws" --include="*.js" --include="*.jsx" app/ components/ libs/ | grep -v node_modules
  ```

- [ ] **Step E3.3: Verificación**

  ```bash
  npm run build
  ```

  Esperado: build exitoso. Si falla por imports rotos → corregir.

- [ ] **✋ Suggested commit checkpoint** — `chore: limpiar env.example y config.js (resend, aws, etc)`.

---

### Task E4: Actualizar documentación

**Files:**
- Modify: `STATUS.md`
- Modify: `CLAUDE.md`
- Modify: `README.md`

- [ ] **Step E4.1: `STATUS.md`** — actualizar Sprint 3 a ✅ COMPLETO

  Actualizar la fila de Sprint 3 y añadir entrada en historial:

  ```
  ### 2026-05-XX - Sprint 3 completado: Upload + Carrito anónimo
  - Direct signed upload a Cloudinary (browser → Cloudinary)
  - Sesión anónima por cookie cart-session-id (httpOnly, 30d)
  - Modelo Cart nuevo con TTL 24h
  - Refactor Design para soportar guests
  - Background removal en cliente con @imgly/background-removal
  - Cron diario de limpieza de huérfanos
  - Eliminación de endpoints legacy (/api/upload, /api/upload/design, /api/test-cloudinary)
  ```

- [ ] **Step E4.2: `CLAUDE.md`** — actualizar Architecture Overview

  Añadir sub-sección "Upload y carrito anónimo" en Architecture Overview:

  ```markdown
  7. **Upload de diseños y carrito anónimo**:
     - Sesión anónima por cookie `cart-session-id` (middleware crea, 30d)
     - Direct signed upload: browser pide firma a `/api/upload/signature`, sube directo a Cloudinary, registra en Mongo via `/api/designs`
     - Modelo `Cart` con items embebidos, TTL 24h (recalculado en cada touch)
     - Background removal en browser con `@imgly/background-removal` (cero costo, sin lock-in)
     - Cleanup automatizado con Vercel Cron diario a 03:00 UTC
  ```

- [ ] **Step E4.3: `README.md`** — actualizar variables de entorno

  Reemplazar la sección "Variables de Entorno" para reflejar lo real:

  ```markdown
  ## 🔧 Variables de Entorno

  ```env
  # MongoDB
  MONGODB_URI=

  # Admin auth (libs/simple-auth.js)
  ADMIN_USERNAME=
  ADMIN_PASSWORD=
  NEXTAUTH_SECRET=

  # Cloudinary
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
  CLOUDINARY_UPLOAD_PRESET=estampanda-stickers

  # Stripe (sub-proyecto #2)
  STRIPE_PUBLIC_KEY=
  STRIPE_SECRET_KEY=
  STRIPE_WEBHOOK_SECRET=

  # Cron de limpieza
  CRON_SECRET=
  ```
  ```

- [ ] **✋ Suggested commit checkpoint** — `docs: actualizar STATUS, CLAUDE y README para sub-proyecto #1`.

---

### Task E5: Verificación final end-to-end

- [ ] **Step E5.1: Smoke test completo**

  1. `npm run dev`
  2. En browser **modo incógnito** (sin cookie previa):
     - Ir a `/stickers/designer`
     - Inspeccionar Application → Cookies → confirmar que existe `cart-session-id`
  3. Subir un PNG ≤ 10 MB → verificar 3 requests (signature, Cloudinary, designs)
  4. Configurar todo → click "Añadir al carrito" → toast OK
  5. Click "Quitar fondo" → ver progreso → ver resultado → preview cambia
  6. Subir otro diseño → configurar → añadir → carrito tiene 2 items
  7. Ir a `/cart`:
     - Editar cantidad de un item → precio actualiza
     - Cambiar material → precio actualiza
     - Borrar un item → desaparece
  8. Cerrar pestaña, volver a abrir incógnito **misma ventana** (no nueva incógnito) → carrito persiste
  9. Verificar Cloudinary dashboard: archivos en `estampanda/temp/<sessionId>/`
  10. Llamar al cron a mano (con `curl`) tras forzar `expiresAt` en el pasado → confirmar borrado

- [ ] **Step E5.2: Build de producción**

  ```bash
  npm run build
  ```

  Esperado: sin errores, sin warnings críticos. Bundle inicial **NO** incluye `@imgly/background-removal` (verificable con `--analyze` si está configurado, o revisando el output: el chunk `node_modules/@imgly/...` debe ser dynamic).

- [ ] **Step E5.3: Lint**

  ```bash
  npm run lint
  ```

  Esperado: sin errores. Si hay warnings de imports no usados de archivos que tocamos → corregir.

- [ ] **✋ Suggested final commit** — `chore: verificación final del sub-proyecto #1`.

---

## Apéndice: variables de entorno necesarias en producción (Vercel)

Antes del primer deploy con este código:

1. Ir al dashboard de Vercel → Project → Settings → Environment Variables
2. Añadir o verificar:
   - `MONGODB_URI` (production)
   - `NEXTAUTH_SECRET`
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET`
   - `STRIPE_*` (si ya existen)
   - **`CRON_SECRET`** (nuevo — generar con `openssl rand -base64 32`, guardar igual en local y prod)
3. En Cloudinary dashboard → Settings → Upload → "Allowed origins" añadir el dominio de prod

---

## Riesgos conocidos y notas para el implementador

1. **Catálogos de materiales/cortes están duplicados** entre `app/api/cart/items/route.js`, `app/api/cart/items/[itemId]/route.js`, `MaterialSelector.js`, `CutTypeSelector.js`. Marcado como TODO post-MVP: extraer a `libs/catalog.js`.
2. **`BASE_PRICE_PER_CM2` placeholder**: el implementador debe copiar el valor real de `PriceCalculator.js` (no inventar).
3. **Vercel function maxDuration**: el endpoint `/api/cron/cleanup-expired` está limitado a 60s en plan Hobby. Si la cantidad de designs expirados se vuelve grande, paginar.
4. **CORS en Cloudinary**: si el upload directo da error CORS en producción, configurar "Allowed origins" en Cloudinary settings.
5. **Tests automatizados**: este plan no añade tests — usa verificación manual. Después de este sub-proyecto, considerar añadir Playwright como sub-proyecto separado para tests E2E del flujo completo.
6. **Reglas de git del usuario**: nunca commit/push automático. El plan marca cada checkpoint con `✋` — ahí debe pedirse permiso.
