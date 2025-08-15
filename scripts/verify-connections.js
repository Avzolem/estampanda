// Cargar variables de entorno primero
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary con las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function verifyConnections() {
  console.log("🔍 Verificando conexiones...\n");

  // Verificar MongoDB
  console.log("📦 MongoDB:");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conexión exitosa a MongoDB");
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    
    // Verificar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   Colecciones existentes: ${collections.map(c => c.name).join(", ") || "ninguna"}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
  }

  console.log("\n☁️ Cloudinary:");
  try {
    // Verificar configuración de Cloudinary
    const config = cloudinary.config();
    console.log("✅ Cloudinary configurado");
    console.log(`   Cloud Name: ${config.cloud_name}`);
    console.log(`   API Key: ${config.api_key ? config.api_key.substring(0, 6) + "..." : "no configurada"}`);
    
    // Verificar acceso (intenta obtener detalles de la cuenta)
    const result = await cloudinary.api.ping();
    console.log("✅ Conexión exitosa a Cloudinary");
    console.log(`   Status: ${result.status}`);
  } catch (error) {
    console.error("❌ Error conectando a Cloudinary:", error.message);
  }

  console.log("\n✨ Verificación completada");
}

verifyConnections().then(() => process.exit(0)).catch(console.error);