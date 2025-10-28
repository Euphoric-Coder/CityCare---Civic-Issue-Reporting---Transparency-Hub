import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 3, // 3 minutes for testing (change to 24*60*60 for prod)
    updateAge: 0, // prevent NextAuth from extending expiry automatically
  },
  jwt: {
    maxAge: 60 * 3, // match same expiry
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          // Fetch user by email from Convex
          const user = await fetchQuery(api.users.getUserByEmail, {
            email: credentials.email,
          });

          if (!user) return null;

          // Verify hashed password
          const valid = await compare(credentials.password, user.password);
          if (!valid) return null;

          // Create and return user payload
          return {
            id: user._id,
            email: user.email,
            name: user.fullName,
            role: user.role,
          };
        } catch (err) {
          console.error("NextAuth authorize error:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Only set exp and user info when signing in
      if (user && !token.realExp) {
        const exp = Math.floor(Date.now() / 1000) + 3 * 60; // 3 minutes (in seconds)
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.realExp = exp;
      }

      // End session if expired
      if (token.realExp && Date.now() / 1000 > token.realExp) {
        console.log("Token expired — clearing session");
        return {};
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id,
          name: token.name,
          role: token.role,
          email: token.email,
        };

        // Fixed expiry time for frontend
        session.realExpiry = new Date(token.realExp * 1000).toISOString();
      } else {
        session = null; // force logout on expiry
      }

      return session;
    },
  },

  // Custom secret for stable JWT signing (important for testing)
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
});

export { handler as GET, handler as POST };
