// Sistema de autenticación simple sin MongoDB
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '***REDACTED***';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || '***REDACTED***';

export async function login(username, password) {
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
    
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });
    
    return { success: true, user: { username: ADMIN_USER, role: 'admin' } };
  }
  
  return { success: false, error: 'Credenciales inválidas' };
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
  return { success: true };
}

export async function getSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) return null;
    
    const decoded = jwt.verify(token.value, JWT_SECRET);
    return {
      user: {
        name: decoded.username,
        email: decoded.email,
        role: decoded.role
      }
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('No autorizado');
  }
  return session;
}

// Alias para compatibilidad con los archivos existentes
export async function auth() {
  return await getSession();
}

export async function verifyAuth() {
  const session = await getSession();
  return session !== null;
}