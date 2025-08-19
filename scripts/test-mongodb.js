const { MongoClient } = require("mongodb");

async function testConnection() {
  console.log("🔍 Probando conexión a MongoDB...");
  console.log("URI:", process.env.MONGODB_URI?.substring(0, 30) + "...");
  
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    console.log("📡 Intentando conectar...");
    await client.connect();
    
    console.log("✅ Conexión exitosa!");
    
    // Probar ping
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping exitoso!");
    
    // Listar bases de datos
    const dbs = await client.db().admin().listDatabases();
    console.log("📊 Bases de datos encontradas:", dbs.databases.map(db => db.name));
    
    await client.close();
    console.log("✅ Conexión cerrada correctamente");
    
  } catch (error) {
    console.error("❌ Error de conexión:");
    console.error("  Tipo:", error.name);
    console.error("  Mensaje:", error.message);
    
    if (error.message.includes("authentication failed")) {
      console.log("\n⚠️  Posible problema: Credenciales incorrectas");
      console.log("   Verifica usuario y contraseña en MongoDB Atlas");
    } else if (error.message.includes("Server selection timed out")) {
      console.log("\n⚠️  Posible problema: MongoDB no es accesible");
      console.log("   1. Ve a MongoDB Atlas");
      console.log("   2. Network Access → Add IP Address");
      console.log("   3. Selecciona 'Allow Access from Anywhere'");
      console.log("   4. O añade tu IP actual");
    }
  }
}

// Cargar variables de entorno
require("dotenv").config({ path: ".env.local" });

testConnection();