import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        // Hacer admin si es tu email
        if (user.email === "andresaguilar.exe@gmail.com") {
          token.role = "admin";
        } else {
          token.role = "user";
        }
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
});

export { handlers, auth, signIn, signOut };