import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '***REDACTED***';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || '***REDACTED***';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { 
          username: ADMIN_USER, 
          role: 'admin',
          email: 'admin@estampanda.com'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      const response = NextResponse.json({ 
        success: true, 
        user: { username: ADMIN_USER, role: 'admin' } 
      });
      
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/'
      });
      
      return response;
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Credenciales inválidas' 
    }, { status: 401 });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error en el servidor' 
    }, { status: 500 });
  }
}