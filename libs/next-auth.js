import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import User from "@/models/User";

// Create safe NextAuth configuration
const createAuthConfig = () => {
  const providers = [];
  
  // Only add Google if properly configured
  if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    providers.push(GoogleProvider({
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
    }));
  }
  
  // Only add Email if properly configured
  if (connectMongo && process.env.RESEND_API_KEY) {
    providers.push(EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: config.resend?.fromNoReply || "noreply@estampanda.com",
    }));
  }
  
  return {
    secret: process.env.NEXTAUTH_SECRET || "development-secret-only",
    providers,
    ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),
    callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Include user role in JWT token
      if (user) {
        token.role = user.role || "user";
      }

      // Refresh user data if session is updated
      if (trigger === "update" && session?.user) {
        try {
          const dbUser = await User.findById(token.sub);
          if (dbUser) {
            token.role = dbUser.role || "user";
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;

        // Always fetch fresh role from database
        try {
          const dbUser = await User.findById(token.sub);
          session.user.role = dbUser?.role || "user";
        } catch (error) {
          console.error("Error fetching user role:", error);
          session.user.role = token.role || "user";
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/images/estampandalogonobg.png`,
  },
  };
};

// Try to create NextAuth instance safely
let authInstance;
try {
  const authConfig = createAuthConfig();
  authInstance = NextAuth(authConfig);
} catch (error) {
  console.error("NextAuth initialization error:", error);
  // Create minimal auth instance for production
  authInstance = NextAuth({
    providers: [],
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
    callbacks: {
      async jwt({ token }) { return token; },
      async session({ session }) { return session; },
    },
    session: { strategy: "jwt" },
  });
}

export const { handlers, auth, signIn, signOut } = authInstance;

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
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
    }),
    ...(connectMongo
      ? [
          EmailProvider({
            server: {
              host: "smtp.resend.com",
              port: 465,
              auth: {
                user: "resend",
                pass: process.env.RESEND_API_KEY,
              },
            },
            from: config.resend.fromNoReply,
          }),
        ]
      : []),
  ],
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role || "user";
      }
      if (trigger === "update" && session?.user) {
        try {
          const dbUser = await User.findById(token.sub);
          if (dbUser) {
            token.role = dbUser.role || "user";
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        try {
          const dbUser = await User.findById(token.sub);
          session.user.role = dbUser?.role || "user";
        } catch (error) {
          console.error("Error fetching user role:", error);
          session.user.role = token.role || "user";
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};
