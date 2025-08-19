const { MongoClient } = require("mongodb");
const dns = require('dns');

async function testConnection() {
  require("dotenv").config({ path: ".env.local" });
  
  console.log("🔍 Diagnóstico MongoDB en WSL2...\n");
  
  // 1. Verificar resolución DNS
  console.log("1️⃣ Verificando DNS:");
  dns.setServers(['8.8.8.8', '8.8.4.4']); // Usar Google DNS
  
  await new Promise((resolve) => {
    dns.resolve4('clusteravsolem.pso8yzc.mongodb.net', (err, addresses) => {
      if (err) {
        console.log("   ❌ No se puede resolver el hostname");
        console.log("   Esto es común en WSL2\n");
      } else {
        console.log("   ✅ IPs encontradas:", addresses);
      }
      resolve();
    });
  });
  
  // 2. Probar conexión con configuración especial para WSL
  console.log("2️⃣ Probando conexión con configuración WSL2:");
  
  const uri = process.env.MONGODB_URI;
  const options = {
    // Opciones específicas para WSL2
    family: 4, // Forzar IPv4
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 20000,
    connectTimeoutMS: 20000,
    directConnection: false,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  };
  
  try {
    console.log("   Conectando (puede tomar hasta 20 segundos)...");
    const client = new MongoClient(uri, options);
    
    await client.connect();
    console.log("   ✅ ¡Conexión exitosa!");
    
    await client.db("admin").command({ ping: 1 });
    console.log("   ✅ Ping exitoso");
    
    await client.close();
    
  } catch (error) {
    console.error("   ❌ Error:", error.message);
    
    console.log("\n🔧 SOLUCIÓN PARA WSL2:");
    console.log("   Opción 1: Ejecuta estos comandos en PowerShell (como admin):");
    console.log("      wsl --shutdown");
    console.log("      netsh winsock reset");
    console.log("      Luego reinicia WSL2");
    console.log("");
    console.log("   Opción 2: Añade esto a /etc/resolv.conf en WSL:");
    console.log("      nameserver 8.8.8.8");
    console.log("      nameserver 8.8.4.4");
    console.log("");
    console.log("   Opción 3: Usa el URI alternativo (sin srv):");
    console.log("      En MongoDB Atlas, selecciona 'Node.js 2.2.12 or later'");
    console.log("      Esto te dará un URI que empieza con 'mongodb://' (sin +srv)");
  }
}

testConnection();