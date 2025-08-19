import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Configuración temporal sin MongoDB mientras se arregla la conexión
const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  // Comentar el adapter temporalmente
  // adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.email === "andresaguilar.exe@gmail.com" ? "admin" : "user",
        };
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
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  debug: true,
};

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };
export const authOptions = authConfig;