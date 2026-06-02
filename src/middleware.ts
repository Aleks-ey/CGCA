import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Refresh the Supabase session — required for Server Components to have
  // an up-to-date session. Must run on every request that uses auth.
  const supabase = createMiddlewareClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ----------------------------------------------------------------
  // Route protection examples — uncomment and customize as needed:
  // ----------------------------------------------------------------

  // Redirect unauthenticated users away from protected routes:
  // if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // Redirect authenticated users away from auth pages:
  // if (user && request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  void user; // suppress unused-variable warning until routes are configured

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - public assets (png, jpg, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
