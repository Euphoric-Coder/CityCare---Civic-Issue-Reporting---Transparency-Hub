import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: [
    // Protect everything except public routes & static assets
    "/((?!$|sign-in|sign-up|public-dashboard|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf)$|api/auth).*)",
  ],
};
