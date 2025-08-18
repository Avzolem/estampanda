# 🚀 GUÍA DE DEPLOYMENT - ESTAMPANDA

## 📋 CHECKLIST DE DEPLOYMENT

### ✅ Estado del Proyecto (17 Agosto 2025)
- [x] Frontend completo y funcional
- [x] APIs REST implementadas
- [x] Cloudinary configurado y funcionando
- [x] MongoDB conectado
- [x] Panel admin funcional
- [x] Build de producción exitoso (con warnings menores)
- [ ] Stripe pendiente (no crítico para MVP)
- [ ] Emails pendiente (no crítico para MVP)

## 🔐 VARIABLES DE ENTORNO PARA VERCEL

Copia estas variables en el panel de Vercel:

```env
# NextAuth (REQUERIDO)
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=genera-uno-nuevo-con-openssl-rand-base64-32

# MongoDB (REQUERIDO)
MONGODB_URI=mongodb+srv://***REDACTED***:***REDACTED***@clusteravsolem.pso8yzc.mongodb.net/estampanda?retryWrites=true&w=majority&appName=ClusterAvsolem

# Cloudinary (REQUERIDO)
CLOUDINARY_CLOUD_NAME=dyalnhdcl
CLOUDINARY_API_KEY=788551393247557
CLOUDINARY_API_SECRET=***REDACTED***
CLOUDINARY_UPLOAD_PRESET=estampanda-stickers

# Google OAuth (OPCIONAL - para login)
GOOGLE_ID=tu-google-client-id
GOOGLE_SECRET=tu-google-client-secret

# Stripe (OPCIONAL - para pagos)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_tu_key
STRIPE_SECRET_KEY=sk_test_tu_key
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Resend (OPCIONAL - para emails)
RESEND_API_KEY=tu_resend_api_key
EMAIL_FROM=noreply@tudominio.com
```

## 📦 PASOS DE DEPLOYMENT EN VERCEL

### 1. Preparación Local
```bash
# Verificar que el build funciona
npm run build

# Commit de cambios
git add .
git commit -m "Preparar para deployment en Vercel"
git push origin main
```

### 2. En Vercel Dashboard

1. **Importar Proyecto**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importa desde GitHub
   - Selecciona el repositorio `estampanda`

2. **Configuración del Proyecto**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (dejar vacío)
   - Build Command: `npm run build`
   - Output Directory: `.next` (automático)
   - Install Command: `npm install`

3. **Variables de Entorno**
   - Copia TODAS las variables del archivo `.env.local`
   - **IMPORTANTE**: Cambia `NEXTAUTH_URL` al dominio de Vercel
   - Genera un nuevo `NEXTAUTH_SECRET` con:
     ```bash
     openssl rand -base64 32
     ```

4. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos

## 🧪 PRUEBAS POST-DEPLOYMENT

### Funcionalidades a Verificar:

1. **Landing Page** ✅
   - [ ] Hero animado carga correctamente
   - [ ] Navegación funciona
   - [ ] Enlaces a designer funcionan

2. **Designer de Stickers** ✅
   - [ ] Upload de imágenes a Cloudinary
   - [ ] Selector de materiales
   - [ ] Selector de tamaños
   - [ ] Calculadora de precios
   - [ ] Navegación entre pasos

3. **Checkout** ✅
   - [ ] Formulario de datos personales
   - [ ] Formulario de dirección
   - [ ] Creación de pedido en MongoDB
   - [ ] Redirección a página de éxito

4. **Panel Admin** ✅
   - [ ] Login con credenciales admin
   - [ ] Lista de pedidos desde MongoDB
   - [ ] Cambio de estados
   - [ ] Exportación a CSV
   - [ ] Estadísticas

5. **Tracking** ✅
   - [ ] Búsqueda por número de pedido
   - [ ] Timeline de estados

## 🔧 CONFIGURACIÓN ADICIONAL

### Dominio Personalizado (Opcional)
1. En Vercel > Settings > Domains
2. Agrega tu dominio: `estampanda.com`
3. Configura DNS según instrucciones de Vercel

### Optimizaciones Recomendadas
1. **Imágenes**: Ya optimizadas con Cloudinary ✅
2. **Base de datos**: Índices ya configurados ✅
3. **Caché**: Headers configurados automáticamente por Vercel ✅

## 🚨 TROUBLESHOOTING

### Error: "NEXTAUTH_URL mismatch"
- Asegúrate que `NEXTAUTH_URL` coincida con el dominio de Vercel
- No incluyas trailing slash `/` al final

### Error: "MongoDB connection failed"
- Verifica que el IP 0.0.0.0/0 esté en whitelist de MongoDB Atlas
- Revisa que el connection string sea correcto

### Error: "Cloudinary upload failed"
- Verifica las credenciales de Cloudinary
- El upload preset debe existir (ya creado: `estampanda-stickers`)

## 📊 MONITOREO

### Métricas a Revisar
- **Vercel Analytics**: Performance, Web Vitals
- **MongoDB Atlas**: Conexiones, queries
- **Cloudinary Dashboard**: Uso de bandwidth y storage

### Logs
- Vercel Functions: Ver logs en tiempo real
- MongoDB Atlas: Performance Advisor
- Cloudinary: Activity logs

## 🎯 PRÓXIMOS PASOS (Post-MVP)

1. **Integrar Stripe** (cuando tengas cuenta)
   - Configurar productos y precios
   - Implementar webhook
   - Probar flujo completo de pago

2. **Configurar Emails** (cuando tengas Resend)
   - Plantillas de confirmación
   - Notificaciones de cambio de estado

3. **Optimizaciones**
   - Implementar ISR para páginas estáticas
   - Agregar PWA support
   - Implementar caché de Redis

## 📝 NOTAS IMPORTANTES

- **MongoDB**: La base de datos ya está en producción (MongoDB Atlas)
- **Cloudinary**: Cuenta gratuita con 25GB de bandwidth mensual
- **Límites**: 
  - Vercel Free: 100GB bandwidth/mes
  - MongoDB Atlas Free: 512MB storage
  - Cloudinary Free: 25 créditos/mes

## ✅ READY TO DEPLOY!

El proyecto está listo para deployment. Las únicas integraciones pendientes (Stripe y Resend) no son críticas para el MVP y pueden agregarse posteriormente sin afectar el funcionamiento actual.

---

**Última actualización**: 17 de Agosto 2025
**Status**: LISTO PARA PRODUCCIÓN 🚀