const { MongoClient } = require("mongodb");
const dns = require('dns').promises;

async function testConnection() {
  // Cargar variables de entorno
  require("dotenv").config({ path: ".env.local" });
  
  const uri = process.env.MONGODB_URI;
  
  console.log("🔍 Análisis detallado de conexión MongoDB...\n");
  
  // 1. Verificar URI
  console.log("1️⃣ Verificando URI:");
  if (!uri) {
    console.error("❌ MONGODB_URI no está definido");
    return;
  }
  
  // Extraer información del URI
  const matches = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
  if (matches) {
    const [, username, password, host, database] = matches;
    console.log("   Usuario:", username);
    console.log("   Contraseña:", password.replace(/./g, '*'));
    console.log("   Host:", host);
    console.log("   Base de datos:", database);
    
    // 2. Verificar DNS del cluster
    console.log("\n2️⃣ Verificando DNS del cluster:");
    try {
      const addresses = await dns.resolve4(host.split('.')[0] + '.mongodb.net');
      console.log("   ✅ DNS resuelve correctamente");
    } catch (error) {
      console.log("   ❌ Error resolviendo DNS:", error.message);
      console.log("   Esto indica un problema con el nombre del cluster");
    }
  }
  
  // 3. Probar conexión con diferentes opciones
  console.log("\n3️⃣ Probando conexión con opciones mejoradas:");
  
  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 1,
    retryWrites: true,
    w: 'majority'
  };
  
  try {
    console.log("   Conectando con timeout de 10 segundos...");
    const client = new MongoClient(uri, options);
    
    await client.connect();
    console.log("   ✅ Conexión exitosa!");
    
    // Probar operaciones básicas
    const db = client.db();
    await db.admin().ping();
    console.log("   ✅ Ping exitoso!");
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log("   ✅ Colecciones encontradas:", collections.length);
    
    await client.close();
    console.log("   ✅ Conexión cerrada");
    
  } catch (error) {
    console.error("\n❌ Error de conexión:");
    console.error("   Tipo:", error.name);
    console.error("   Código:", error.code);
    console.error("   Mensaje:", error.message);
    
    // Análisis específico del error
    console.log("\n🔧 Posibles soluciones:");
    
    if (error.message.includes("authentication failed")) {
      console.log("   ⚠️ Credenciales incorrectas:");
      console.log("      - Verifica el usuario y contraseña en MongoDB Atlas");
      console.log("      - Database Access → Edit user → Reset password");
    } else if (error.message.includes("Server selection timed out")) {
      console.log("   ⚠️ No se puede conectar al servidor:");
      console.log("      - Verifica en MongoDB Atlas:");
      console.log("        1. Network Access → IP Whitelist incluye 0.0.0.0/0");
      console.log("        2. El cluster está activo (no pausado)");
      console.log("        3. El nombre del cluster es correcto");
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("   ⚠️ No se puede resolver el hostname:");
      console.log("      - Verifica que el cluster name sea correcto");
      console.log("      - El formato debe ser: clustername.xxxxx.mongodb.net");
    } else if (error.message.includes("connect ETIMEDOUT")) {
      console.log("   ⚠️ Timeout de red:");
      console.log("      - Puede ser un firewall bloqueando el puerto 27017");
      console.log("      - Verifica tu conexión a internet");
    }
  }
}

testConnection();