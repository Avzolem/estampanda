import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Primera vez que el usuario inicia sesión
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // Verificar rol en cada sesión
      if (token.email === "andresaguilar.exe@gmail.com") {
        token.role = "admin";
      } else {
        token.role = user?.role || "user";
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      // Hacer admin automáticamente cuando inicies sesión
      if (user.email === "andresaguilar.exe@gmail.com") {
        try {
          const { MongoClient } = require("mongodb");
          const client = new MongoClient(process.env.MONGODB_URI);
          await client.connect();
          
          const db = client.db("estampanda");
          await db.collection("users").updateOne(
            { email: user.email },
            { $set: { role: "admin" } }
          );
          
          await client.close();
          console.log("✅ Usuario configurado como admin");
        } catch (error) {
          console.error("Error actualizando rol:", error);
        }
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handlers, auth, signIn, signOut };