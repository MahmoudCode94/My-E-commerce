import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("userToken")?.value;
    const isLoggedIn = !!token;
    const { pathname } = req.nextUrl;

    const protectedRoutes = ['/cart', '/wishlist', '/checkout', '/allorders', '/addresses', '/profile', '/update-profile'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const guestRoutes = ['/login', '/signup', '/register', '/forgot-password'];
    const isGuestRoute = guestRoutes.some(route => pathname.startsWith(route));

    if (isGuestRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
