import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";

// Configuración segura que no falla si faltan variables de entorno
const providers = [];

// Solo agregar Google si las variables están configuradas
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    })
  );
}

// Solo agregar Email si las variables están configuradas
if (connectMongo && process.env.RESEND_API_KEY) {
  providers.push(
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: config.resend?.fromNoReply || "noreply@estampanda.com",
    })
  );
}

// Configuración base que funciona sin providers
const authConfig = {
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors?.main || "#275D5C",
    logo: `https://${config.domainName || "estampanda.com"}/images/estampandalogonobg.png`,
  },
};

// Solo agregar secret si está configurado
if (process.env.NEXTAUTH_SECRET) {
  authConfig.secret = process.env.NEXTAUTH_SECRET;
}

// Solo agregar adapter si MongoDB está disponible
if (connectMongo) {
  authConfig.adapter = MongoDBAdapter(connectMongo);
}

// Crear una instancia segura de NextAuth
let authInstance;
try {
  authInstance = NextAuth(authConfig);
} catch (error) {
  console.error("NextAuth initialization error:", error);
  // Crear una instancia mínima sin providers
  authInstance = NextAuth({
    providers: [],
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-only-for-dev",
    callbacks: authConfig.callbacks,
    session: authConfig.session,
  });
}

export const { handlers, auth, signIn, signOut } = authInstance;

// Función auxiliar segura para verificar autenticación
export async function getSession() {
  try {
    return await auth();
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export const authOptions = authConfig;