# Estado del Proyecto - Estampanda

**Última actualización:** 8 de Mayo 2026

---

## Resumen Ejecutivo

Plataforma de venta de stickers personalizados con **Next.js 15** (App Router). El flujo de cliente está funcional end-to-end excepto el paso de pago: subir diseño → quitar fondo (opcional) → configurar material/tamaño/corte/cantidad → añadir al carrito multi-diseño → editar carrito → **(pendiente)** checkout con Stripe.

---

## Estado de Sprints

| Sprint | Nombre | Estado |
|--------|--------|--------|
| 0 | Setup y Configuración | ✅ COMPLETO |
| 1 | Sistema de Diseño | ✅ COMPLETO |
| 2 | Landing y Catálogo | ✅ COMPLETO |
| 3 | Upload y Carrito anónimo | ✅ COMPLETO (sub-proyecto #1) |
| 4 | Panel Admin Básico | 🔄 PARCIAL (dashboard real, pedidos pendiente Stripe) |
| 5 | Stripe Checkout | ⏳ PENDIENTE (sub-proyecto #2) |

---

## Sub-proyectos completados (8 May 2026)

| # | Sub-proyecto | Commit principal |
|---|---|---|
| #1 | Upload de diseños + Carrito anónimo persistente | Fases A-E |
| #10 | Higiene de configuración (archive docs, borrar scripts root) | `2f66df1` |
| #13 | Limpiar git history con `git filter-repo` + force push | force push post `c14b899` |
| #4 | Documentar deuda técnica en `/api/orders` (frozen pending Stripe) | `7a4f0a5` |
| #7 | Configurador refinado (toggle Original/Sin fondo, DPI expandido, quick-quantities) | `adfed68` |
| #11 | SEO + performance (metadata via layout.js, sitemap, next/image en Header) | `4de0e29` |
| #12 | Testing E2E con Playwright (8 smoke tests + scripts npm) | `a175f4f` |
| #6 | Admin panel con datos reales (dashboard de designs/carts; orders banner) | `b2ff373` |
| #8 | Landing — 3 secciones nuevas (HowItWorks, WhyEstampanda, CTAFinal) | `a43d3b8` |

---

## Sub-proyectos PENDIENTES (próxima sesión)

Los siguientes requieren **decisiones de producto/UX** del usuario y por eso no se ejecutaron con autorización amplia.

### #2 Stripe Checkout end-to-end (CRÍTICO para producción)
**Tamaño:** L (1.5 sem). **Bloquea:** #5 emails, #9 tracking, finalización de admin orders.

**Pendiente:**
- Refactor del modelo `Order`: hoy es 1-orden-por-checkout-individual; debe soportar `items[]` (uno por CartItem del Cart).
- Conversión Cart → Order en el momento del checkout (snapshot de pricing, vinculación de Designs, marcar Designs como `expiresAt: null` cuando la orden se paga).
- `POST /api/stripe/create-checkout` que reciba `cartId` y devuelva la session URL.
- Webhook `/api/webhook/stripe`: verificar firma, actualizar `Order.status: 'pending' → 'processing'`, vincular `paymentIntentId`.
- Página `/stickers/success` que muestre la orden recién creada.
- Endpoints `/api/orders/[orderNumber]` para consulta pública por número de orden (sin login).

**Decisiones que tomará el usuario al abrir el sub-proyecto:**
- ¿Stripe Checkout (URL hospedada) o Payment Element embebido?
- ¿Tax calculation con Stripe Tax o manual (16% IVA México)?
- ¿Shipping rates dinámicas o fijas por código postal?
- ¿Captura del `email` del cliente para guest checkout?

**Acción manual previa al deploy:**
- Configurar `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET` en Vercel (Settings → Environment Variables).
- Crear webhook endpoint en Stripe Dashboard apuntando a `https://estampanda.com/api/webhook/stripe`.

### #3 Auth admin robusta
**Tamaño:** M (1 sem). **No bloquea nada urgente**, pero el sistema actual es admin único hardcoded.

**Decisiones que tomará el usuario:**
- ¿Mantener simple-auth (1 admin por env vars) o migrar a multi-admin?
- Si multi-admin: ¿Google OAuth, magic links de email, o usuario/password con tabla User real?
- ¿Roles (admin/editor/viewer) o todos full-access?
- ¿Recovery de contraseña?

### #5 Sistema de emails
**Tamaño:** M (1 sem). **Mejor después de #2** (las plantillas necesitan datos de Order real).

**Decisiones que tomará el usuario:**
- Proveedor: Resend (vuelve), AWS SES, Mailgun, Postmark.
- Plantillas iniciales: confirmación de pedido, cambio de estado, prueba digital, envío con tracking.
- ¿Email de "carrito abandonado" después de 23h?

### #9 Tracking de pedidos para cliente
**Tamaño:** S (2-3 días). **Depende de #2 Stripe** (necesita `Order` real).

**Pendiente:**
- Página `/stickers/tracking?order=STK-...` que consulta `/api/orders/[orderNumber]` y muestra timeline (pending → processing → printing → shipped → delivered).
- Generación del link y email al confirmar pago (parte de #5).

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework | Next.js | 15.4.6 |
| React | React | 19.1.1 |
| Estilos | Tailwind CSS | 4.1.11 |
| UI | DaisyUI | 5.0.50 |
| Animaciones | Framer Motion | 12.23.12 |
| Base de datos | MongoDB + Mongoose | 8.17.1 |
| Pagos | Stripe (instalado, sin cablear) | 18.4.0 |
| Imágenes | Cloudinary | 2.7.0 |
| Background removal | `@imgly/background-removal` (browser) | 1.7.0 |
| Cache cliente | SWR | 2.4.1 |
| Testing E2E | Playwright | 1.59.1 |

---

## Estado de Seguridad

### Vulnerabilidades npm audit (8 May 2026)
| Severidad | Cantidad | Estado |
|-----------|----------|--------|
| Crítica | 0 | ✅ |
| High | 0 | ✅ |
| Moderate | 2 | ⚠️ requieren upgrade a Next.js 16 (breaking) |
| Low | 0 | ✅ |

### Limpieza de history (8 May 2026)
- `git filter-repo` redactó 6 strings sensibles en blobs y commit messages.
- Force push aplicado a `origin/main`.
- Backup local en `backup-pre-filter-2026-05-08` (no pusheado).
- Credenciales del `.env.local` no rotadas por decisión del usuario; el history público ya no las contiene, pero los caches de GitHub pueden mantenerlas hasta 90 días.

---

## Variables de entorno necesarias (producción)

```
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

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Lint
npm run lint

# Tests E2E (1ª vez instala browsers ~300MB)
npm run test:e2e:install
npm run test:e2e

# Auditoría de seguridad
npm audit
```

---

## Documentación

- `CLAUDE.md` — instrucciones para Claude Code (reglas, arquitectura, env vars)
- `docs/superpowers/specs/` — diseños aprobados por sub-proyecto
- `docs/superpowers/plans/` — planes de implementación por sub-proyecto
- `docs/archive/` — docs legacy (Plan de Construccion, COMPONENTS_STRUCTURE)

---

## Historial de Cambios Recientes

### 8 May 2026 - Sesión 2: 7 sub-proyectos adicionales
Continuación post sub-proyecto #1. Autorización amplia del usuario para ejecutar sin pedir permiso entre fases.

- **#10 Higiene**: archivados Plan de Construccion.md y COMPONENTS_STRUCTURE.md a `docs/archive/`; borrados scripts root (fix-images, fix-warnings, replace-all-images), `yarn.lock`, `app/stickers/gallery/page.js` (rota); `ButtonSupport.js` simplificado a link a `/contact`; `.gitignore` reforzado con .env, .env.production, .env.development.
- **#13 Seguridad**: `git filter-repo --replace-text` + `--replace-message` redactó 6 secrets de blobs y commit messages; force push a origin/main; backup local en branch `backup-pre-filter-2026-05-08`.
- **#4 Orders API**: documentada deuda técnica en cabecera del route.js (endpoints frozen pending Stripe sub-project; el modelo Order se refactorizará completo allí).
- **#7 Configurador refinado**: toggle Original/Sin fondo, DPI badge expandido con texto explicativo + warning visual, fondo ajedrez transparente, animaciones Framer Motion, sección de precios reorganizada con scale animation, BackgroundRemovalButton con barra de progreso y "Reintentar"; quick-quantities con badge de descuento %, steppers ±10, botón "Subir otro diseño".
- **#11 SEO + performance**: metadata por página via layout.js (contact, how-it-works, products, designer); sitemap actualizado (gallery removida, +rutas marketing); logo Header migrado a `next/image` con priority.
- **#12 Testing E2E**: Playwright instalado + 8 smoke tests (landing, header con CartBadge, cookie cart-session-id, FileUploader visible, /cart vacío, /api/cart, /api/cron/cleanup-expired auth, /api/upload/signature validación).
- **#6 Admin panel**: `/api/admin/dashboard` reescrito con stats reales (designs total/24h/7d/with-bg-removed, carts active/empty/items/value, recent designs feed); `DashboardStats.js` consume datos reales con 4 stat cards + 3 insights + activity feed; `OrdersManager.js` con banner "Módulo en transición".
- **#8 Landing**: 3 secciones nuevas — `HowItWorks.js` (3 pasos), `WhyEstampanda.js` (6 diferenciadores honestos), `CTAFinal.js` (cierre con gradiente brand). `app/page.js` reordenado: Hero → HowItWorks → WhyEstampanda → PriceCalculator → CTAFinal.

### 8 May 2026 - Sub-proyecto #1: Upload + Carrito anónimo COMPLETO
- Direct signed upload a Cloudinary (browser → Cloudinary directo, fuera del límite Vercel 4.5MB).
- Sesión anónima por cookie `cart-session-id` (httpOnly, 30d).
- Modelo `Cart` nuevo con items embebidos y TTL 24h auto-recalculado.
- Refactor `Design`: soporta sessionId para guests, eliminados campos heredados.
- Background removal en cliente con `@imgly/background-removal` (cero costo, sin lock-in, ~80MB lazy load).
- Cron diario de limpieza con Vercel Cron a 03:00 UTC.
- Endpoints legacy `/api/upload`, `/api/upload/design` mantenidos por GalleryManager admin (deuda futura).
- Credenciales admin movidas de hardcoded a env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
- `libs/pricing.js`: lógica única de precios extraída de calculadoras duplicadas.

### 4 Feb 2026 - Optimización y Seguridad
- Corregidas 8 vulnerabilidades de seguridad.
- Eliminadas dependencias no usadas: multer, react-color, react-intersection-observer, resend.
- Eliminados 14 archivos de código muerto.
- Limpiados imports no usados.
- Total: -3062 líneas de código.

### 15 Ago 2025 - Sprint 3 Completado
- Sistema de upload de diseños.
- Checkout flow.
- Calculadora de precios.
