import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/arrival-card",
  "/immigration",
  "/government",
  "/admin",
  "/profile",
];

// Routes that are only accessible when NOT authenticated
const authRoutes = ["/auth/login", "/auth/register"];

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  "/immigration": ["IMMIGRATION", "ADMIN"],
  "/government": ["GOVERNMENT", "ADMIN"],
  "/admin": ["ADMIN"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Check if the route is an auth route (login, register)
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect non-logged-in users to login for protected routes
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Check role-based access
  if (isLoggedIn && userRole) {
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (
        nextUrl.pathname.startsWith(route) &&
        !allowedRoles.includes(userRole)
      ) {
        // Redirect to dashboard if user doesn't have permission
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
