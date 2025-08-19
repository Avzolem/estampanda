#!/bin/bash

echo "🧹 Limpiando caché..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Reinstalando dependencias de autenticación..."
npm install next-auth@beta @auth/mongodb-adapter mongodb --save

echo "✅ Listo! Ahora ejecuta:"
echo "npm run dev"
echo ""
echo "📝 Notas importantes:"
echo "1. MongoDB está temporalmente deshabilitado"
echo "2. Puedes iniciar sesión con Google"
echo "3. Si usas andresaguilar.exe@gmail.com serás admin automáticamente"
echo "4. Para arreglar MongoDB:"
echo "   - Ve a MongoDB Atlas"
echo "   - Network Access → Add IP Address → Allow from Anywhere"