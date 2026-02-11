import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('userToken')?.value;
    const { pathname } = request.nextUrl;

    // 1. Protected Routes (User must be logged in)
    // user tries to access /cart, /wishlist, /checkout, etc. without token -> redirect to /login
    const protectedRoutes = ['/cart', '/wishlist', '/checkout', '/allorders', '/addresses', '/profile', '/update-profile'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // Optional: Add ?callbackUrl=... to redirect back after login
        return NextResponse.redirect(loginUrl);
    }

    // 2. Guest Routes (User must NOT be logged in)
    // user tries to access /login, /signup while logged in -> redirect to /
    const guestRoutes = ['/login', '/signup', '/register', '/forgot-password'];
    const isGuestRoute = guestRoutes.some(route => pathname.startsWith(route));

    if (isGuestRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
