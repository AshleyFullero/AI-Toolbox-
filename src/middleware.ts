import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Lightweight middleware for route protection.
 *
 * We use cookie-based session detection instead of importing auth() to avoid
 * pulling bcryptjs (Node.js-only) into the Edge Runtime. The heavy auth
 * validation is performed in each protected server component via auth().
 *
 * NextAuth.js v5 with database sessions stores a session token cookie.
 * The cookie name follows the pattern: authjs.session-token (dev) or
 * __Secure-authjs.session-token (prod).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/register');

  // Check for session cookie (NextAuth v5 database session token)
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value;

  const isAuthenticated = Boolean(sessionToken);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - Public image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
