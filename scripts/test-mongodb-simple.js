const { MongoClient } = require("mongodb");

async function testConnection() {
  require("dotenv").config({ path: ".env.local" });
  
  // Probar con el URI exacto de MongoDB Atlas
  const uri = process.env.MONGODB_URI;
  
  console.log("🔍 Probando conexión MongoDB...");
  console.log("URI completo:", uri);
  console.log("");
  
  try {
    // Intentar conexión simple sin opciones especiales
    const client = new MongoClient(uri);
    
    console.log("📡 Conectando...");
    await client.connect();
    
    console.log("✅ ¡Conexión exitosa!");
    
    // Intentar listar bases de datos
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log("📊 Bases de datos disponibles:");
    dbs.databases.forEach(db => console.log("   -", db.name));
    
    await client.close();
    console.log("✅ Conexión cerrada correctamente");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    // Si es error de DNS, intentar con ping
    if (error.message.includes("ENOTFOUND") || error.message.includes("timed out")) {
      console.log("\n🔍 Verificando conectividad...");
      const { exec } = require('child_process');
      exec('ping -c 1 clusteravsolem.pso8yzc.mongodb.net', (err, stdout, stderr) => {
        if (err) {
          console.log("❌ No se puede alcanzar el servidor MongoDB");
          console.log("   Posibles causas:");
          console.log("   1. El cluster está pausado en MongoDB Atlas");
          console.log("   2. Problema de red local o firewall");
          console.log("   3. El nombre del cluster cambió");
        } else {
          console.log("✅ El servidor responde al ping");
          console.log("   El problema puede ser de autenticación o configuración");
        }
      });
    }
  }
}

testConnection();