# Estampanda - Plataforma de Stickers Personalizados 🎨

Plataforma e-commerce para crear y vender stickers personalizados de alta calidad con envío rápido en México.

## 🚀 Características

- **Diseñador de Stickers**: Herramienta intuitiva para personalizar stickers
- **Múltiples Materiales**: Vinilo, holográfico, transparente, mate, brillante y más
- **Tamaños Personalizables**: Desde 3cm hasta 50cm con dimensiones personalizadas
- **Upload de Diseños**: Integración con Cloudinary para gestión de imágenes
- **Panel Administrativo**: Gestión completa de pedidos, productos y materiales
- **Sistema de Precios Dinámico**: Descuentos por volumen automáticos
- **Tracking de Pedidos**: Seguimiento en tiempo real del estado del pedido

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 19, Tailwind CSS
- **Backend**: Node.js, API Routes de Next.js
- **Base de Datos**: MongoDB con Mongoose
- **Storage**: Cloudinary para imágenes
- **Pagos**: Stripe (pendiente de integración)
- **Hosting**: Vercel

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/estampanda.git
cd estampanda
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔧 Variables de Entorno

```env
# MongoDB
MONGODB_URI=tu_uri_de_mongodb

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret

# Admin
ADMIN_USERNAME=tu_usuario
ADMIN_PASSWORD=tu_contraseña

# Stripe (cuando lo configures)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm start` - Ejecutar build de producción
- `npm run lint` - Linter
- `npm run postbuild` - Generar sitemap

## 🎨 Paleta de Colores

- **Primary**: #275D5C (Verde Teal Oscuro)
- **Secondary**: #F5E6D3 (Beige/Crema)
- **Accent**: #4FA09F (Teal Claro)
- **Light**: #FBF7F2 (Crema Claro)

## 📁 Estructura del Proyecto

```
estampanda/
├── app/                # Páginas y rutas (App Router)
│   ├── admin/         # Panel administrativo
│   ├── api/           # API Routes
│   └── stickers/      # Sección de stickers
├── components/        # Componentes reutilizables
├── models/           # Modelos de MongoDB
├── libs/             # Utilidades y configuración
└── public/           # Archivos estáticos
```

## 🚀 Estado del Proyecto

- ✅ Frontend completo (95%)
- ✅ Panel admin funcional
- ✅ APIs implementadas
- ✅ MongoDB conectado
- ✅ Cloudinary integrado
- ⏳ Stripe pendiente
- ⏳ Sistema de emails pendiente

## 📞 Soporte

Para soporte o consultas sobre el proyecto, contacta a:
- Email: soporte@estampanda.com
- WhatsApp: +52 555 123 4567

## 📄 Licencia

© 2025 Estampanda. Todos los derechos reservados.

---

**Desarrollado con 💚 para crear los mejores stickers personalizados de México**