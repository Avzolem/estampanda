# Estado del Proyecto - Estampanda

**Última actualización:** 8 de Mayo 2026

---

## Resumen Ejecutivo

Plataforma de venta de stickers personalizados con Next.js 14. El frontend está 90% completo, pendiente integración de servicios externos para producción.

---

## Estado de Sprints

| Sprint | Nombre | Estado |
|--------|--------|--------|
| 0 | Setup y Configuración | ✅ COMPLETO |
| 1 | Sistema de Diseño | ✅ COMPLETO |
| 2 | Landing y Catálogo | ✅ COMPLETO |
| 3 | Upload y Checkout | ✅ COMPLETO |
| 4 | Panel Admin Básico | 🔄 EN PROGRESO |

---

## Estado de Seguridad

### Vulnerabilidades npm audit
| Severidad | Cantidad | Estado |
|-----------|----------|--------|
| Crítica | 0 | ✅ |
| High | 0 | ✅ |
| Moderate | 1* | ⚠️ |
| Low | 0 | ✅ |

*La vulnerabilidad moderate restante (Next.js PPR) requiere actualizar a Next.js 16 (breaking change mayor).

### Última auditoría: 4 Feb 2026
- Se corrigieron 8 de 9 vulnerabilidades
- Se eliminaron 4 dependencias no usadas
- Se eliminaron 14 archivos de código muerto (-3062 líneas)

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework | Next.js | 15.5.11 |
| React | React | 19.1.1 |
| Estilos | Tailwind CSS | 4.1.11 |
| UI Components | DaisyUI | 5.0.50 |
| Animaciones | Framer Motion | 12.23.12 |
| Base de datos | MongoDB + Mongoose | 8.17.1 |
| Pagos | Stripe | 18.4.0 |
| Imágenes | Cloudinary | 2.7.0 |

---

## Integraciones Pendientes para Producción

### 1. Cloudinary ✅ COMPLETO
- Direct signed upload implementado, sesión anónima, modelo Cart con TTL 24h, cron de limpieza

### 2. Stripe (PENDIENTE)
- **Archivos:** `app/api/stripe/*`
- **Estado:** Endpoints creados, sin keys de producción
- **Pendiente:**
  - Configurar keys de producción
  - Probar flujo completo de checkout
  - Configurar webhook en Stripe Dashboard

### 3. MongoDB (PARCIAL)
- **Estado:** Conexión configurada, modelos básicos
- **Pendiente:**
  - APIs completas de CRUD
  - Seeders de datos iniciales

### 4. Emails (PENDIENTE)
- sub-proyecto futuro. Resend fue eliminado, considerar AWS SES, Mailgun o reinstalar Resend cuando se necesite.

---

## Estructura de Archivos Actual

```
estampanda/
├── app/
│   ├── (private)/admin/     # Panel de administración
│   ├── api/                 # Endpoints API
│   ├── stickers/            # Páginas de stickers
│   ├── contact/             # Página de contacto
│   ├── how-it-works/        # Cómo funciona
│   └── ...
├── components/
│   ├── stickers/            # Componentes de stickers
│   ├── common/              # Componentes comunes
│   ├── Header.js
│   └── Footer.js
├── libs/                    # Utilidades y configuración
├── models/                  # Modelos Mongoose (User, Order, Design)
└── public/                  # Assets estáticos
```

---

## Dependencias Actuales (package.json)

```json
{
  "@headlessui/react": "^2.2.7",
  "@heroicons/react": "^2.2.0",
  "@stripe/stripe-js": "^7.8.0",
  "axios": "^1.11.0",
  "canvas-confetti": "^1.9.3",
  "cloudinary": "^2.7.0",
  "daisyui": "^5.0.50",
  "framer-motion": "^12.23.12",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.17.1",
  "next": "^15.4.6",
  "react": "^19.1.1",
  "react-dropzone": "^14.3.8",
  "react-hot-toast": "^2.5.2",
  "react-tooltip": "^5.29.1",
  "sharp": "^0.34.3",
  "stripe": "^18.4.0",
  "tailwindcss": "^4.1.11"
}
```

---

## Próximos Pasos Recomendados

1. **Configurar Cloudinary** - Para upload real de imágenes
2. **Configurar Stripe** - Keys de producción y webhooks
3. **Completar Panel Admin** - Lista de pedidos y cambio de estados
4. **Configurar Emails** - Reinstalar Resend y crear plantillas
5. **Testing E2E** - Probar flujo completo de compra

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Verificar vulnerabilidades
npm audit

# Lint
npm run lint
```

---

## Historial de Cambios Recientes

### 8 May 2026 - Sub-proyecto #1: Upload + Carrito anónimo COMPLETO
- Direct signed upload a Cloudinary (browser → Cloudinary directo, fuera del límite Vercel 4.5MB)
- Sesión anónima por cookie cart-session-id (httpOnly, 30d)
- Modelo Cart nuevo con items embebidos y TTL 24h auto-recalculado
- Refactor Design: soporta sessionId para guests, eliminados campos heredados
- Background removal en cliente con @imgly/background-removal (cero costo, sin lock-in, ~80MB lazy load)
- Cron diario de limpieza con Vercel Cron a 03:00 UTC
- Endpoints legacy /api/upload, /api/upload/design eliminados (nota: GalleryManager admin todavía los usa, pendiente migrar)
- Credenciales admin movidas de hardcoded a env vars (ADMIN_USERNAME, ADMIN_PASSWORD)
- libs/pricing.js: lógica única de precios extraída de calculadoras duplicadas

### 4 Feb 2026 - Optimización y Seguridad
- Corregidas 8 vulnerabilidades de seguridad
- Eliminadas dependencias no usadas: multer, react-color, react-intersection-observer, resend
- Eliminados 14 archivos de código muerto
- Limpiados imports no usados
- Total: -3062 líneas de código

### 15 Ago 2025 - Sprint 3 Completado
- Sistema de upload de diseños
- Checkout flow
- Calculadora de precios
