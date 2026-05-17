import { NextRequest, NextResponse } from "next/server";
import authConfig from "@/lib/auth/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/admin", "/new-product", "/settings", "/my-products", "/my-upvoted"];

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const isProtectedRoute = protectedRoutes.some(
    (route) => nextUrl.pathname.startsWith(route)
  );

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
