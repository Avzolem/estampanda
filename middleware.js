import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Proteger /admin (lógica existente)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Asegurar cookie cart-session-id en rutas relevantes
  const isSessionPath =
    pathname.startsWith('/stickers') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/api/cart') ||
    pathname.startsWith('/api/designs') ||
    pathname.startsWith('/api/upload');

  if (isSessionPath && !request.cookies.get('cart-session-id')) {
    const response = NextResponse.next();
    response.cookies.set('cart-session-id', crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/stickers/:path*',
    '/cart/:path*',
    '/api/cart/:path*',
    '/api/designs/:path*',
    '/api/upload/:path*',
  ],
};
