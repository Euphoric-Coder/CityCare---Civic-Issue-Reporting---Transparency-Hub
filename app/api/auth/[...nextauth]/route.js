import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    // maxAge: 24 * 60 * 60, // 1 day in seconds
    maxAge: 60 * 3, // now for testing purpose
  },
  jwt: {
    // maxAge: 24 * 60 * 60, // 1 day in seconds
    maxAge: 60 * 3, // now for testing purpose
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

          // Fetch user by email from Convex (using your indexed query)
          const user = await fetchQuery(api.users.getUserByEmail, {
            email: credentials.email,
          });

          if (!user) return null;

          // Verify hashed password
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) return null;

          // Return user object for session
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
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
