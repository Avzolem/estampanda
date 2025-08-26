# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 PROYECTO ACTUAL: ESTAMPANDA - Plataforma de Stickers Personalizados

### 🚨 PENDIENTES CRÍTICOS PARA PRODUCCIÓN

**IMPORTANTE**: El frontend está 90% completo, pero faltan las integraciones reales:

1. **Cloudinary** (FileUploader.js):

   - Configurar API keys reales
   - Implementar upload real en lugar de URL.createObjectURL

2. **Stripe** (checkout/page.js):

   - Configurar keys de producción
   - Crear endpoint `/api/stripe/create-checkout`
   - Implementar webhook `/api/stripe/webhook`

3. **MongoDB** - Crear APIs:

   - `/api/orders` - CRUD de pedidos
   - `/api/upload` - Gestión de uploads
   - `/api/admin/orders` - Panel admin

4. **Emails** (Resend):
   - Configurar plantillas de confirmación
   - Email de cambio de estado

### 📍 ÚLTIMO PROGRESO (15 Agosto 2025)

- ✅ Sprint 0: Setup y Configuración - COMPLETO
- ✅ Sprint 1: Sistema de Diseño - COMPLETO
- ✅ Sprint 2: Landing y Catálogo - COMPLETO
- ✅ Sprint 3: Upload y Checkout - COMPLETO (falta integración)
- 🔄 **SPRINT ACTUAL**: Sprint 4 - Panel Admin Básico
  - Lista de pedidos
  - Cambio de estados
  - Exportar CSV

### 🎨 CONTEXTO DEL PROYECTO

Estamos construyendo una plataforma de venta de stickers personalizados con:

- Hero page animado con temática de stickers
- Sistema de upload y diseño de stickers
- Configurador de materiales, tamaños y tipos de corte
- Calculadora de precios dinámica
- Panel de administración completo

### 📚 DOCUMENTOS DE REFERENCIA

- Ver `Plan de Construccion.md` para el roadmap completo
- Ver `COMPONENTS_STRUCTURE.md` para entender la arquitectura actual

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

1. **Node Version**: Requires Node.js 20+ (check `.nvmrc`)
2. Copy `.env.example` to `.env.local`
3. Fill in required environment variables:
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Set to `http://localhost:3000` for development
   - `MONGODB_URI`: MongoDB connection string
   - `GOOGLE_ID` & `GOOGLE_SECRET`: From Google Cloud Console OAuth 2.0 credentials
   - `STRIPE_PUBLIC_KEY` & `STRIPE_SECRET_KEY`: From Stripe Dashboard (use test keys for development)
   - `STRIPE_WEBHOOK_SECRET`: From Stripe webhook endpoint settings (configure at `/api/webhook/stripe`)
   - `RESEND_API_KEY`: From Resend Dashboard for transactional emails
   - `EMAIL_FROM`: Default sender email address

## Architecture Overview

Esta es una aplicación Next.js 14 (App Router) para el e-commerce de Estampanda con características completas para venta de stickers personalizados.

### Core Stack

- **Frontend**: Next.js 14 with React 19, Tailwind CSS + DaisyUI
- **Auth**: NextAuth.js v5 beta (Google OAuth + Magic Links)
- **Database**: MongoDB with Mongoose ODM
- **Payments**: Stripe (subscriptions + customer portal)
- **Email**: Resend for transactional emails
- **Support**: Crisp chat integration

### Key Architectural Decisions

1. **App Router Structure**: Uses Next.js 14 app directory with:

   - `(private)/` group for authenticated routes
   - Parallel route groups for user and admin dashboards
   - API routes in `/app/api/`
   - Path imports using `@/*` alias

2. **Authentication Flow**:

   - NextAuth v5 configuration in `/libs/next-auth.js`
   - MongoDB adapter for session storage
   - Role-based access control (user, admin, editor, moderator)
   - JWT strategy with database sessions
   - Protected routes use session checks from `libs/next-auth.js`

3. **Database Architecture**:

   - Models in `/models/` directory with Mongoose ODM
   - User model with Stripe customer integration and role management
   - Lead capture model for waitlist functionality
   - Custom JSON serialization plugin for clean API responses

4. **Payment Integration**:

   - Stripe checkout flow: `/app/api/stripe/create-checkout/`
   - Webhook handling: `/app/api/webhook/stripe/` with signature verification
   - Customer portal: `/app/api/stripe/create-portal/`
   - Plans configured in `config.js`
   - Automatic access management based on payment status

5. **Component Organization**:
   - Shared components in `/components/`
   - Route-specific components colocated with pages
   - Blog components in `/app/blog/_assets/components/`

### Configuration Management

**Central config file**: `config.js` contains:

- App metadata and branding
- Stripe pricing plans configuration
- Email settings and templates
- Theme/color customization
- Authentication redirect paths
- Customer support settings (Crisp)

### API Route Patterns

All API routes follow RESTful conventions:

- `/api/auth/[...nextauth]/` - NextAuth.js handlers
- `/api/lead` - Lead capture and waitlist
- `/api/stripe/*` - Payment operations
- `/api/admin/*` - Admin operations (protected)
- `/api/webhook/*` - External webhooks

### Styling Approach

- Tailwind CSS with custom animations (wiggle, popup, shimmer, appearFromRight)
- DaisyUI component classes with theme support
- Light/dark theme switching
- Custom gradients and glass morphism effects

### No Testing Framework

Currently no automated tests - consider adding Jest/React Testing Library for unit tests and Playwright for E2E tests when needed.
