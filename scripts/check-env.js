#!/usr/bin/env node

// Script para verificar las variables de entorno necesarias
// Ejecutar con: node scripts/check-env.js

const requiredEnvVars = {
  critical: [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ],
  recommended: [
    'MONGODB_URI',
    'GOOGLE_ID', 
    'GOOGLE_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY',
    'RESEND_API_KEY',
  ],
  optional: [
    'STRIPE_WEBHOOK_SECRET',
    'CLOUDINARY_UPLOAD_PRESET',
    'ADMIN_EMAIL',
    'ORDER_NOTIFICATIONS_EMAIL',
    'GA_MEASUREMENT_ID',
  ]
};

console.log('🔍 Verificando variables de entorno para Estampanda...\n');

let hasErrors = false;
let hasWarnings = false;

// Verificar críticas
console.log('❗ Variables CRÍTICAS (requeridas para funcionar):');
for (const envVar of requiredEnvVars.critical) {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Configurada`);
  } else {
    console.log(`  ❌ ${envVar}: NO CONFIGURADA - La aplicación podría fallar`);
    hasErrors = true;
  }
}

console.log('\n📌 Variables RECOMENDADAS (para funcionalidad completa):');
for (const envVar of requiredEnvVars.recommended) {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Configurada`);
  } else {
    console.log(`  ⚠️  ${envVar}: No configurada - Algunas funciones estarán limitadas`);
    hasWarnings = true;
  }
}

console.log('\n💡 Variables OPCIONALES (mejoras adicionales):');
for (const envVar of requiredEnvVars.optional) {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Configurada`);
  } else {
    console.log(`  ℹ️  ${envVar}: No configurada`);
  }
}

// Resumen
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ HAY ERRORES CRÍTICOS: Configura las variables marcadas con ❌');
  console.log('   La aplicación podría no funcionar correctamente.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  HAY ADVERTENCIAS: Algunas funciones estarán limitadas.');
  console.log('   La aplicación funcionará pero sin todas las características.');
} else {
  console.log('✅ TODAS LAS VARIABLES ESTÁN CONFIGURADAS CORRECTAMENTE');
  console.log('   La aplicación está lista para producción.');
}

console.log('\n📝 Para configurar en Vercel:');
console.log('   1. Ve a tu proyecto en Vercel');
console.log('   2. Settings > Environment Variables');
console.log('   3. Agrega cada variable con su valor correspondiente');
console.log('   4. Redeploy para aplicar los cambios\n');