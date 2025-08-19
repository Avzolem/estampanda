import { NextResponse } from 'next/server';

export function middleware(request) {
  // Solo proteger rutas /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Por ahora solo verificamos que exista el token
    // La verificación real se hace en el servidor
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};