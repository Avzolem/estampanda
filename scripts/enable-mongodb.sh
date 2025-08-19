#!/bin/bash

echo "🔄 Habilitando MongoDB en NextAuth..."

# Hacer backup del actual
cp libs/next-auth.js libs/next-auth-no-mongo.js

# Copiar la versión con MongoDB
cp libs/next-auth-with-mongo.js libs/next-auth.js

echo "✅ MongoDB habilitado en NextAuth"
echo ""
echo "⚠️  IMPORTANTE: Asegúrate de que MongoDB Atlas esté configurado:"
echo "   1. Network Access → Allow from Anywhere (0.0.0.0/0)"
echo "   2. Database Access → Usuario correcto"
echo ""
echo "🔄 Reinicia el servidor con: npm run dev"