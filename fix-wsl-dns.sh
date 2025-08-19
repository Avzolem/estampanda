#!/bin/bash

echo "🔧 Arreglando DNS en WSL2 para MongoDB..."

# Hacer backup del resolv.conf actual
sudo cp /etc/resolv.conf /etc/resolv.conf.backup

# Crear nuevo resolv.conf con Google DNS
echo "# Fixed DNS for MongoDB connection" | sudo tee /etc/resolv.conf
echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf
echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf
echo "nameserver 1.1.1.1" | sudo tee -a /etc/resolv.conf

echo "✅ DNS actualizado"
echo ""
echo "🔍 Verificando conexión..."
node scripts/test-mongodb-simple.js