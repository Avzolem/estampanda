#!/usr/bin/env node

/**
 * Script para crear un usuario administrador directamente
 * Uso: node scripts/create-admin.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Configurar variables de entorno
dotenv.config({ path: ".env.local" });

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  role: {
    type: String,
    enum: ["user", "admin", "editor", "moderator"],
    default: "user",
  },
  customerId: String,
  priceId: String,
  hasAccess: Boolean,
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
  const email = "andresaguilar.exe@gmail.com";
  const name = "Andrés Aguilar";

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI no está configurado en .env.local");
    process.exit(1);
  }

  try {
    // Conectar a MongoDB
    console.log("🔌 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Buscar si el usuario ya existe
    console.log(`🔍 Verificando si el usuario ya existe...`);
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      console.log(`👤 Usuario encontrado: ${user.name || "Sin nombre"}`);
      console.log(`📋 Rol actual: ${user.role || "user"}`);
      
      // Actualizar a admin
      user.role = "admin";
      await user.save();
      
      console.log("✅ Usuario actualizado a administrador");
    } else {
      // Crear nuevo usuario admin
      console.log("👤 Usuario no encontrado, creando nuevo usuario admin...");
      
      user = await User.create({
        email: email.toLowerCase(),
        name: name,
        role: "admin",
        hasAccess: true,
      });
      
      console.log("✅ ¡Usuario administrador creado exitosamente!");
    }
    
    console.log("\n🎉 LISTO! Ya puedes acceder como administrador");
    console.log("📧 Email:", email);
    console.log("👤 Nombre:", user.name || name);
    console.log("🔑 Rol:", user.role);
    console.log("\n📌 Información importante:");
    console.log("1. Inicia sesión en la app con:", email);
    console.log("2. Accede al panel admin en: /admin/dashboard");
    console.log("3. Gestión de pedidos en: /admin/orders");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Desconectado de MongoDB");
  }
}

// Ejecutar script
createAdmin();