# 🌳 ESTRUCTURA COMPLETA DE COMPONENTES - PROYECTO ESTAMPANDA

## 📁 `/components/` (Componentes Reutilizables)

### 🔸 Componentes de UI Base
- **BetterIcon.js** → Wrapper para iconos mejorados con estilos consistentes
- **Modal.js** → Componente modal reutilizable para diálogos y popups
- **Tabs.js** → Sistema de pestañas para organizar contenido

### 🔸 Botones de Acción
- **ButtonAccount.js** → Botón de gestión de cuenta de usuario
- **ButtonCheckout.js** → Botón para iniciar proceso de pago con Stripe (pagos únicos o suscripciones)
- **ButtonGradient.js** → Botón con estilos de gradiente personalizados
- **ButtonLead.js** → Captura de emails para waitlist/leads (formulario de suscripción)
- **ButtonPopover.js** → Botón con menú desplegable/popover
- **ButtonSignin.js** → Botón de inicio de sesión
- **ButtonSupport.js** → Botón para abrir chat de soporte (Crisp)

### 🔸 Secciones de Landing Page
- **Header.js** → Barra de navegación principal
- **Hero.js** → Sección hero con título, subtítulo y CTAs principales
- **CTA.js** → Sección de Call-to-Action
- **Problem.js** → Sección que describe el problema que resuelve el producto
- **WithWithout.js** → Comparación "Con vs Sin" el producto

### 🔸 Features y Beneficios
- **FeaturesAccordion.js** → Features en formato acordeón expandible
- **FeaturesGrid.js** → Grid de características del producto
- **FeaturesListicle.js** → Lista de features en formato artículo

### 🔸 Pricing
- **Pricing.js** → Tabla/cards de precios con planes de Stripe

### 🔸 Social Proof
- **Testimonials1.js** → Layout de testimonios estilo 1
- **Testimonials3.js** → Layout de testimonios estilo 3
- **Testimonials11.js** → Layout de testimonios estilo 11
- **Testimonial1Small.js** → Testimonio individual compacto
- **TestimonialRating.js** → Componente de rating/estrellas
- **TestimonialsAvatars.js** → Grupo de avatares de clientes

### 🔸 FAQ y Footer
- **FAQ.js** → Sección de preguntas frecuentes
- **Footer.js** → Pie de página con links y información

### 🔸 Layout
- **LayoutClient.js** → Layout wrapper para cliente

## 📁 `/components/admin/` (Componentes de Admin)
- **users/UserForm.js** → Formulario para crear/editar usuarios

## 📁 `/components/common/` (Componentes Comunes)
- **LoadingCircle.js** → Indicador de carga circular
- **PageSizeSelect.js** → Selector de items por página
- **Pagination.js** → Componente de paginación

## 📁 `/components/forms/` (Formularios)
- **fields/ButtonSubmit.js** → Botón de envío de formulario
- **fields/Input.js** → Campo de entrada de texto
- **fields/TextArea.js** → Campo de texto multilínea
- **fields/index.js** → Exportación de todos los campos

---

## 📁 `/app/` (Estructura de Rutas Next.js 14)

### 🔐 `(private)/` - Rutas Autenticadas

#### `(user)/dashboard/`
Dashboard del usuario autenticado
- **page.js** → Página principal del dashboard
- **layout.js** → Layout del dashboard de usuario

#### `admin/dashboard/`
Panel de administración completo
- **page.js** → Dashboard principal admin
- **layout.js** → Layout del admin
- **Sidebar.js** → Barra lateral de navegación admin
- **MobileHeader.js** → Header móvil para admin
- **users/** → Gestión de usuarios
  - **page.js** → Lista de usuarios
  - **new/page.js** → Crear nuevo usuario
  - **edit/[id]/page.js** → Editar usuario específico

### 🔌 `api/` - Rutas de API

#### Autenticación
- **auth/[...nextauth]/** → Autenticación con NextAuth.js (Google OAuth + Magic Links)

#### Lead Generation
- **lead/** → Captura de leads/emails para waitlist

#### Stripe Integration
- **stripe/create-checkout/** → Crear sesión de pago
- **stripe/create-portal/** → Portal de cliente Stripe
- **webhook/stripe/** → Webhook para eventos de Stripe (pagos, suscripciones)

#### Admin API
- **admin/dashboard/** → API del dashboard admin
- **admin/users/** → CRUD de usuarios
  - **[id]/** → Operaciones por usuario específico

### 📝 `blog/` - Sistema de Blog

- **page.js** → Lista de artículos del blog
- **[articleId]/page.js** → Artículo individual
- **author/[authorId]/page.js** → Artículos por autor
- **category/[categoryId]/page.js** → Artículos por categoría
- **layout.js** → Layout del blog
- **_assets/components/**
  - **Avatar.js** → Avatar de autor
  - **BadgeCategory.js** → Badge de categoría
  - **CardArticle.js** → Card de artículo
  - **CardCategory.js** → Card de categoría
  - **HeaderBlog.js** → Header específico del blog
- **_assets/content.js** → Contenido y datos del blog
- **_assets/images/authors/** → Imágenes de autores

### 📄 Páginas Principales

- **page.js** → Landing page principal
- **layout.js** → Layout raíz de la aplicación
- **error.js** → Página de error personalizada
- **not-found.js** → Página 404
- **privacy-policy/page.js** → Política de privacidad
- **tos/page.js** → Términos de servicio

### 🎨 Assets y Estilos

- **globals.css** → Estilos globales con Tailwind CSS
- **favicon.ico** → Favicon del sitio
- **icon.png** → Icono de la aplicación
- **apple-icon.png** → Icono para dispositivos Apple
- **opengraph-image.png** → Imagen para Open Graph (compartir en redes)
- **twitter-image.png** → Imagen para Twitter Cards

---

## 🏗️ Arquitectura y Flujo de Datos

### 1. **Landing Page Flow**
```
Usuario → Landing (page.js) → Componentes UI (/components/)
         ↓
    ButtonLead → API /api/lead → MongoDB (Lead collection)
```

### 2. **Autenticación Flow**
```
Usuario → ButtonSignin → NextAuth.js → Google OAuth / Magic Link
         ↓
    Session → MongoDB (User collection) → Dashboard privado
```

### 3. **Pagos Flow**
```
Usuario → ButtonCheckout → Stripe Checkout API
         ↓
    Stripe → Webhook /api/webhook/stripe → Actualiza User
         ↓
    Portal de cliente → Gestión de suscripción
```

### 4. **Dashboard Usuario Flow**
```
Usuario autenticado → /(private)/(user)/dashboard
                     ↓
    Acceso basado en rol y estado de pago
```

### 5. **Panel Admin Flow**
```
Admin → /(private)/admin/dashboard → Gestión completa
       ↓
    CRUD usuarios, métricas, configuración
```

### 6. **Blog System Flow**
```
Visitante → /blog → Lista artículos
           ↓
    Filtros por categoría/autor → Artículo individual
```

---

## 🎯 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + React 19
- **Estilos**: Tailwind CSS + DaisyUI
- **Auth**: NextAuth.js v5 beta
- **Database**: MongoDB + Mongoose ODM
- **Pagos**: Stripe (Checkout + Customer Portal)
- **Email**: Resend
- **Soporte**: Crisp Chat
- **Hosting**: Optimizado para Vercel

---

## 📝 Notas de Desarrollo

### Convenciones de Código
- Componentes en PascalCase
- Archivos de componentes con extensión .js
- Imports con alias `@/` para paths absolutos
- Client components marcados con `"use client"`

### Estructura de Datos
- **User Model**: Incluye roles, customerId de Stripe, hasAccess
- **Lead Model**: Email y timestamp para waitlist
- **Configuración**: Centralizada en `config.js`

### Mejores Prácticas
- Componentes reutilizables en `/components/`
- Lógica de negocio en API routes
- Autenticación verificada en layouts privados
- Webhooks de Stripe con verificación de firma
- Variables de entorno en `.env.local`

---

## 🚀 Quick Start

1. **Instalar dependencias**: `npm install`
2. **Configurar variables de entorno**: Copiar `.env.example` a `.env.local`
3. **Configurar MongoDB**: Añadir connection string
4. **Configurar Stripe**: Añadir keys de test
5. **Configurar NextAuth**: Generar secret y configurar Google OAuth
6. **Iniciar desarrollo**: `npm run dev`

---

*Documentación generada para el proyecto Estampanda - Plataforma de Stickers Personalizados*