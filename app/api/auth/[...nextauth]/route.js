import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { api, internal } from "@/convex/_generated/api";
import { fetchQuery, fetchAction, fetchMutation } from "convex/nextjs";
import crypto from "crypto";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day = 86400 seconds
    updateAge: 0, // prevent silent session extension
  },
  jwt: {
    maxAge: 24 * 60 * 60, // match same expiry
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          // Attempt verified sign-in via Convex verifyUser action
          try {
            const authResult = await fetchAction(api.auth.verifyUser, {
              email: credentials.email.toLowerCase().trim(),
              password: credentials.password,
              role: credentials.role,
            });

            if (authResult?.success && authResult?.user) {
              return {
                id: authResult.user.id,
                email: authResult.user.email,
                name: authResult.user.name,
                role: authResult.user.role,
                sessionToken: authResult.token || authResult.sessionToken,
              };
            }
          } catch (actionErr) {
            console.warn("fetchAction verifyUser fallback:", actionErr?.message);
          }

          // Fallback: Fetch user by email from Convex and verify password locally
          const user = await fetchQuery(api.users.getUserByEmail, {
            email: credentials.email.toLowerCase().trim(),
          });

          if (!user) return null;

          // Check role match
          if (credentials.role && user.role !== credentials.role) {
            console.warn("Role mismatch:", {
              selected: credentials.role,
              actual: user.role,
            });
            return null;
          }

          // Verify password
          const valid = await compare(credentials.password, user.password);
          if (!valid) return null;

          // Create session record in Convex
          const tokenBytes = crypto.randomBytes(32).toString("hex");
          const sessionToken = "citycare_sec_" + tokenBytes;
          const secret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || "citycare-session-token-secret-v1";
          const tokenHash = crypto.createHmac("sha256", secret).update(sessionToken).digest("hex");
          const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

          try {
            await fetchMutation(internal.authInternal.createSessionRecord, {
              userId: user._id,
              role: user.role,
              tokenHash,
              expiresAt,
            });
          } catch (mutErr) {
            console.warn("Unable to create session record:", mutErr?.message);
          }

          return {
            id: user._id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            sessionToken,
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
        const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day from now
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.email = user.email;
        token.sessionToken = user.sessionToken;
        token.realExp = exp;
      }

      // Expire token if time passed
      if (token.realExp && Date.now() / 1000 > token.realExp) {
        console.warn("JWT expired — clearing session");
        return {}; // clears session
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
          sessionToken: token.sessionToken,
        };

        // Provide expiry timestamp to frontend
        session.realExpiry = new Date(token.realExp * 1000).toISOString();
      } else {
        session = null; // clear expired sessions
      }

      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: "citycare.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: "citycare.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "citycare-local-development-secret-key-minimum-64-characters-required-for-hs512-compliance",
});

export { handler as GET, handler as POST };
