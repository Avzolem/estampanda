#!/usr/bin/env node

/**
 * Script para eliminar un usuario de MongoDB
 * Uso: node scripts/delete-user.js <email>
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
  role: String,
  customerId: String,
  priceId: String,
  hasAccess: Boolean,
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// También necesitamos limpiar las cuentas de NextAuth
const accountSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  provider: String,
  providerAccountId: String,
}, {
  timestamps: true,
});

const Account = mongoose.models.Account || mongoose.model("Account", accountSchema);

async function deleteUser() {
  const email = process.argv[2] || "andresaguilar.exe@gmail.com";

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
      console.log(`❌ No se encontró usuario con email: ${email}`);
      process.exit(1);
    }

    console.log(`👤 Usuario encontrado: ${user.name || "Sin nombre"}`);
    console.log(`📋 ID: ${user._id}`);
    console.log(`📋 Rol: ${user.role || "user"}`);
    
    // Eliminar cuentas asociadas
    const accounts = await Account.deleteMany({ userId: user._id });
    console.log(`🗑️  Eliminadas ${accounts.deletedCount} cuentas asociadas`);
    
    // Eliminar usuario
    await User.deleteOne({ _id: user._id });
    console.log("✅ Usuario eliminado exitosamente");
    
    console.log("\n📌 Siguiente paso:");
    console.log("1. Inicia sesión normalmente con Google usando:", email);
    console.log("2. NextAuth creará el usuario automáticamente");
    console.log("3. Ejecuta: node scripts/make-admin.js", email);
    console.log("4. Cierra sesión y vuelve a iniciar");
    console.log("5. Ya podrás acceder al panel admin");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Desconectado de MongoDB");
  }
}

// Ejecutar script
deleteUser();