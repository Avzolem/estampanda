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

## ⚠️ REGLAS IMPORTANTES DE DESARROLLO

### Git

- **NUNCA hacer `git push` a menos que se pida explícitamente**
- **NUNCA añadir co-authored-by de Claude en los commits**
- **NO incluir emojis ni referencias a Claude en mensajes de commit**
- Solo hacer commits locales cuando sea necesario
- Usar mensajes de commit descriptivos y profesionales

### Diseño Responsivo

- **SIEMPRE diseñar primero para desktop y luego optimizar para mobile**
- Cuando se pidan modificaciones visuales, aplicar primero en desktop (md: o lg:)
- Luego añadir breakpoints para tablet (sm:) y móvil (base)
- Orden de trabajo: Desktop → Tablet → Móvil

### Estándares de Botones

**REGLA CRÍTICA: SIEMPRE aplicar padding a TODOS los botones sin excepción**

- **Desktop (md:)**: px-24 py-3.5
- **Tablet (sm:)**: px-16 py-3
- **Móvil (base)**: px-8 py-2.5

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

This is a **ShipFast** Next.js 14 (App Router) SaaS boilerplate with pre-built features for rapid startup development.

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
