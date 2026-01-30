import type { NextAuthConfig } from "next-auth";

// Define Role type inline to avoid importing Prisma in edge runtime
export type Role = "USER" | "IMMIGRATION" | "GOVERNMENT" | "ZIMRA" | "ADMIN";

declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: Role;
      image?: string | null;
    };
  }
}

// Edge-compatible auth config (no database imports)
export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Public routes - accessible without login
      const publicRoutes = [
        "/",
        "/auth",
        "/trip/new",
        "/trip/lookup",
        "/help",
        "/privacy-policy",
        "/terms-of-service",
        "/accessibility",
      ];

      const isPublicRoute = publicRoutes.some((route) =>
        pathname === route || pathname.startsWith(route + "/")
      );

      if (isPublicRoute) {
        return true;
      }

      // Protected routes require login
      return isLoggedIn;
    },
  },
  providers: [], // Added in auth.ts
};
