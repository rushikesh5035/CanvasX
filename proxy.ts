import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth(async function proxy(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  // If logged in, block login/signup and redirect to dashboard
  if (session && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protected routes
  const protectedRoutes = ["/project"];

  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // // Protect dashboard route
  // if (!session && pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  return NextResponse.next();
});
export const config = {
  matcher: [
    "/project/:path*",
    "/api/project/:path*",
    "/((?!api/auth|_next/static|_next/image|favicon.ico|api/inngest|$).*)",
  ],
};
