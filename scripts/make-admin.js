#!/usr/bin/env node

/**
 * Script para convertir un usuario en administrador
 * Uso: node scripts/make-admin.js <email>
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

// Configurar variables de entorno
dotenv.config({ path: ".env.local" });

// Definir el esquema de usuario directamente
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

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Por favor proporciona un email");
    console.log("Uso: node scripts/make-admin.js usuario@email.com");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI no está configurado en .env.local");
    process.exit(1);
  }

  try {
    // Conectar a MongoDB
    console.log("🔌 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Buscar usuario
    console.log(`🔍 Buscando usuario con email: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ No se encontró usuario con email: ${email}`);
      process.exit(1);
    }

    // Actualizar rol
    console.log(`👤 Usuario encontrado: ${user.name || "Sin nombre"}`);
    console.log(`📋 Rol actual: ${user.role || "user"}`);
    
    user.role = "admin";
    await user.save();
    
    console.log("✅ ¡Usuario actualizado a administrador exitosamente!");
    console.log(`🎉 ${email} ahora es administrador`);
    
    // Mostrar información adicional
    console.log("\n📌 Información importante:");
    console.log("- El usuario debe cerrar sesión y volver a iniciar para que los cambios surtan efecto");
    console.log("- Acceso al panel admin en: /admin/dashboard");
    console.log("- Gestión de pedidos en: /admin/orders");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Desconectado de MongoDB");
  }
}

// Ejecutar script
makeAdmin();