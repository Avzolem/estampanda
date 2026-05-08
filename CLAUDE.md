# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 PROYECTO: ESTAMPANDA - Plataforma de Stickers Personalizados

Plataforma e-commerce para crear y vender stickers personalizados (Next.js 15, App Router). Incluye landing animada, upload de diseños, configurador de materiales/tamaños/cortes, calculadora de precios dinámica y panel de administración.

### 📍 Estado del Proyecto

**Fuente de verdad: `STATUS.md`** — leer SIEMPRE al iniciar sesión. Contiene el estado de sprints, integraciones pendientes (Cloudinary real, Stripe producción, emails), vulnerabilidades y stack actualizado. No duplicar ese contenido aquí para evitar desincronización.

### 📚 Documentos de Referencia

- `STATUS.md` — estado actual y pendientes
- `Plan de Construccion.md` — roadmap completo
- `COMPONENTS_STRUCTURE.md` — inventario de componentes y rutas (nota: contiene secciones de plantilla original — blog, NextAuth — que no aplican; ver "Architecture Overview" más abajo para lo que realmente existe)

## ⚠️ REGLAS CRÍTICAS - NUNCA ROMPER ESTAS REGLAS

### 🚨 REGLAS ABSOLUTAS DE GIT 🚨
1. **NUNCA hacer `git commit` sin que el usuario lo pida explícitamente**
2. **NUNCA hacer `git push` sin que el usuario lo pida explícitamente**
3. **Solo hacer commit cuando el usuario diga: "haz commit", "commit" o similar**
4. **Solo hacer push cuando el usuario diga: "haz push", "push" o similar**
5. **Los cambios en archivos SÍ se pueden hacer, pero NO commitear sin permiso**

## ⚠️ REGLAS IMPORTANTES DE DESARROLLO

### 🔴 SEGURIDAD - REGLA CRÍTICA ABSOLUTA

**NUNCA JAMÁS escribir claves de API, secrets, tokens, contraseñas o credenciales reales en:**
- `.env.example` o cualquier archivo de ejemplo
- Archivos de documentación (`.md`, `.txt`, etc.)
- Comentarios en el código fuente
- Scripts de configuración o testing
- Archivos de debugging
- NINGÚN archivo que pueda ser subido a git

**SIEMPRE:**
- Usar variables de entorno desde `.env.local` (que está en .gitignore)
- En archivos de ejemplo, usar SOLO placeholders genéricos:
  - `your-api-key-here`
  - `sk_test_xxx...`
  - `REPLACE_WITH_YOUR_SECRET`
  - `your_mongodb_uri_here`
- Verificar que archivos con secrets estén en `.gitignore`
- Si accidentalmente se escribe un secret, informar INMEDIATAMENTE al usuario antes de cualquier commit

**⚠️ GitHub bloqueará automáticamente pushes con secrets expuestos ⚠️**

### Git - 🔴🔴🔴 REGLA MÁXIMA PRIORIDAD 🔴🔴🔴

**⛔ PROHIBIDO ABSOLUTAMENTE:**
- **NUNCA ejecutar `git commit` sin que el usuario escriba EXACTAMENTE "haz commit" o "commit"**
- **NUNCA ejecutar `git push` sin que el usuario escriba EXACTAMENTE "haz push" o "push"**
- **NUNCA hacer commits "para ayudar" o "para completar la tarea"**
- **NUNCA hacer push "porque ya hice commit"**

**SI HAGO COMMIT O PUSH SIN PERMISO:**
- Es una violación GRAVE de confianza
- El usuario tiene derecho a estar molesto
- Debo disculparme inmediatamente
- Debo esperar instrucciones explícitas

**FRASES VÁLIDAS DEL USUARIO PARA COMMIT:**
- "haz commit"
- "commit"
- "commitea"
- NADA MÁS cuenta como permiso

**FRASES VÁLIDAS DEL USUARIO PARA PUSH:**
- "haz push"
- "push"
- "pushea"
- NADA MÁS cuenta como permiso

**OTRAS REGLAS GIT:**
- **NUNCA añadir co-authored-by de Claude en los commits**
- **NUNCA incluir referencias a Claude, AI o "Generated with Claude" en mensajes de commit**
- **SÍ usar emojis relevantes en los commits SOLO cuando el usuario pida hacer commit**

### Diseño Responsivo y Espaciado - 🎯 REGLA CRÍTICA 🎯

**OBLIGATORIO EN TODOS LOS COMPONENTES:**

1. **Espaciado Responsivo Progresivo:**
   - Móvil (base): Espaciados base más pequeños
   - Tablet (sm/md): Espaciados medianos  
   - Desktop (lg/xl): Espaciados generosos
   - Ejemplo padding: `p-4 sm:p-6 md:p-8 lg:p-10`
   - Ejemplo gap: `gap-4 sm:gap-6 md:gap-8 lg:gap-10`

2. **Secciones con Espaciado Vertical:**
   - Hero sections: `pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-24`
   - Secciones normales: `py-8 sm:py-12 md:py-16 lg:py-20`
   - Entre elementos: `mb-4 sm:mb-6 md:mb-8 lg:mb-10`

3. **Breakpoints Consistentes:**
   - base: < 640px (móvil)
   - sm: ≥ 640px (móvil grande)
   - md: ≥ 768px (tablet)
   - lg: ≥ 1024px (desktop)
   - xl: ≥ 1280px (desktop grande)

4. **Texto Escalable:**
   - Títulos: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`
   - Subtítulos: `text-xl sm:text-2xl md:text-3xl lg:text-4xl`
   - Párrafos: `text-base sm:text-lg md:text-xl lg:text-2xl`

5. **Cards y Contenedores:**
   - SIEMPRE usar padding interno progresivo: `p-6 sm:p-8 md:p-10`
   - Gap entre cards: `gap-6 sm:gap-8 md:gap-10 lg:gap-12`
   - Margin bottom entre secciones: `mb-8 sm:mb-12 md:mb-16`

6. **Separación con Footer - OBLIGATORIO:**
   - **REGLA CRÍTICA**: El último elemento antes del Footer SIEMPRE debe tener margin-bottom
   - Último componente/card: `mb-12 sm:mb-16 md:mb-20 lg:mb-24`
   - Última sección: `pb-16 sm:pb-20 md:pb-24 lg:pb-32`
   - NUNCA dejar elementos pegados al Footer
   - Si usas `<section>`, aplicar padding-bottom a la sección
   - Si no hay section, aplicar margin-bottom al último elemento

7. **Orden de trabajo:** Desktop → Tablet → Móvil

### Estándares de Botones

**REGLA CRÍTICA: SIEMPRE aplicar padding RESPONSIVO a TODOS los botones sin excepción**

**Padding Obligatorio Progresivo:**
- Base (móvil): `px-6 py-3`
- Small (sm): `px-8 py-3.5` o `px-8 py-4`
- Medium (md): `px-10 py-4` o `px-12 py-4.5`
- Large (lg): `px-12 py-5` o `px-16 py-5`
- Extra Large (xl): `px-16 py-5` o `px-20 py-6`

**Ejemplo correcto de botón responsivo:**
```jsx
className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-5 xl:px-16 xl:py-6"
```

**IMPORTANTE**: 
- Nunca crear botones sin padding
- El padding debe ser consistente en todo el proyecto
- Para botones pequeños o iconos, usar mínimo px-6 py-2
- Todos los botones deben tener `rounded-lg` (NO rounded-full)

## Common Development Commands

### Development

```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate sitemap (automatically runs after build)
npm run postbuild
```

### Environment Setup

1. **Node Version**: Node.js 20+ (ver `.nvmrc`)
2. Copiar `.env.example` a `.env.local`
3. Variables realmente usadas en el código:
   - `MONGODB_URI` — connection string de MongoDB (consumida en `libs/mongoose.js`)
   - `NEXTAUTH_SECRET` — secret para firmar JWT del admin (generar con `openssl rand -base64 32`). El nombre se mantiene por compatibilidad histórica; **no** hay NextAuth instalado.
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — credenciales del único admin. **Hoy están hardcoded** en `libs/simple-auth.js:5-6`; pendiente moverlas a env (viola la regla de seguridad nº 10).
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` / `CLOUDINARY_UPLOAD_PRESET` — usadas en `libs/cloudinary.js` y `app/api/upload/*`
   - `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — `libs/stripe.js`, `app/api/stripe/*`, `app/api/webhook/stripe/*`
   - `NEXT_PUBLIC_*` equivalents donde aplique (Stripe public)

> Nota: `.env.example` heredado de la plantilla ShipFast lista `GOOGLE_ID`, `GOOGLE_SECRET`, `RESEND_API_KEY`, etc. Esas integraciones **no existen** en el código actual y pueden ignorarse hasta que se reactiven.

## Architecture Overview

Aplicación **Next.js 15** (App Router, React 19) para el e-commerce de stickers personalizados.

### Core Stack

- **Framework**: Next.js 15.4.x + React 19, Tailwind CSS 4 + DaisyUI 5
- **Animación**: Framer Motion
- **Auth admin**: JWT propio (sin NextAuth) — ver `libs/simple-auth.js`
- **DB**: MongoDB + Mongoose 8
- **Pagos**: Stripe (checkout único por pedido — no suscripciones)
- **Imágenes**: Cloudinary (upload de diseños del cliente) + `sharp` para procesado local
- **Soporte**: Crisp chat opcional vía `components/ButtonSupport.js` (id en `config.js`, hoy vacío)
- **Email**: ninguno actualmente — Resend fue eliminado (ver STATUS.md, 4 Feb 2026). `config.js` aún conserva un bloque `resend` con direcciones, pero no hay SDK instalado.

### Decisiones arquitectónicas clave

1. **Routing (App Router)**:
   - `/app` con grupo `(private)/admin` para rutas autenticadas
   - Páginas públicas: `/`, `/stickers`, `/products`, `/precios`, `/muestras`, `/how-it-works`, `/contact`, `/login`, `/privacy-policy`, `/tos`
   - Sin sistema de blog (a pesar de lo que diga `COMPONENTS_STRUCTURE.md`)
   - Alias de imports `@/*` configurado en `jsconfig.json`

2. **Auth (admin único)**:
   - `libs/simple-auth.js` emite un JWT firmado con `NEXTAUTH_SECRET` y lo guarda en cookie `auth-token` (httpOnly, 7 días)
   - `middleware.js` protege `/admin/*` exigiendo presencia del token; la verificación real (jwt.verify) ocurre en server components / API
   - Helpers exportados: `login`, `logout`, `getSession`, `requireAuth`, `auth` (alias), `verifyAuth`
   - Endpoints: `app/api/auth/login/route.js`, `app/api/auth/logout/route.js`
   - **No hay** `/api/auth/[...nextauth]`, MongoDB adapter, Google OAuth, ni magic links

3. **Modelos Mongoose** (`/models`):
   - `User.js` — cuenta de usuario (incluye campos heredados para Stripe customer y rol; el sistema de auth no los usa hoy)
   - `Order.js` — pedidos de stickers
   - `Design.js` — diseños subidos por el cliente
   - `models/plugins/toJSON.js` — serializador JSON consistente para respuestas API

4. **Pagos (Stripe)**:
   - Pago único por pedido, no suscripción (ver `config.js:18-43`, `priceId` placeholder según `NODE_ENV`)
   - Endpoints: `app/api/stripe/create-checkout/`, `app/api/stripe/create-portal/`
   - Webhook con verificación de firma: `app/api/webhook/stripe/`
   - El precio se calcula dinámicamente en `components/PriceCalculator.js` según material, tamaño y cantidad

5. **Upload de diseños (Cloudinary)**:
   - `libs/cloudinary.js` envuelve el SDK
   - `app/api/upload/route.js` y `app/api/upload/design/route.js` manejan subidas
   - `app/api/test-cloudinary/` para pruebas de conectividad
   - El componente cliente que aún muestra mock con `URL.createObjectURL` está en `components/stickers/FileUploader.js` (ver pendientes en STATUS.md)

6. **Organización de componentes**:
   - `/components` — compartidos (Header, Footer, Hero, PriceCalculator, ButtonSupport, LayoutClient)
   - `/components/stickers` — específicos del flujo de stickers (FileUploader, etc.)
   - `/components/admin` — UI de administración
   - `/components/common` — primitivas (LoadingCircle, Pagination, PageSizeSelect)
   - Componentes específicos de ruta colocalizados en sus carpetas de `/app`

### Configuración central (`config.js`)

- Metadatos de app (`appName`, `domainName`, descripción)
- Configuración de Crisp (id, rutas donde mostrar)
- Plan único de Stripe para pedidos de stickers
- Bloque `resend` legacy con direcciones (no se envía mail hoy)
- Tema DaisyUI personalizado `estampanda` con paleta corporativa (`colors`)

### Patrón de rutas API

Endpoints existentes en `/app/api`:

- `auth/login`, `auth/logout` — login JWT del admin
- `lead` — captura de email para waitlist
- `orders`, `orders/[id]` — CRUD de pedidos
- `upload`, `upload/design` — subidas a Cloudinary
- `stripe/create-checkout`, `stripe/create-portal`
- `webhook/stripe` — verificación de firma + actualización de estado
- `admin/dashboard`, `admin/users/[id]` — operaciones protegidas
- `test-cloudinary` — diagnóstico

### Estilos

- Tailwind CSS v4 con `@tailwindcss/postcss`
- DaisyUI 5 con tema custom `estampanda`
- Animaciones custom (wiggle, popup, shimmer, appearFromRight) y Framer Motion para transiciones de página/hero
- Glass morphism en el header (ver commits recientes)

### Sin framework de testing

No hay tests automatizados. Antes de declarar un cambio "completo" en flujos críticos (upload, checkout, webhooks), validar manualmente en `npm run dev` y registrar lo probado en el commit.
