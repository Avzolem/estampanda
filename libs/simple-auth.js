// Sistema de autenticación simple sin MongoDB
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida no configurada: ${name}`);
  }
  return value;
}

export async function login(username, password) {
  const adminUser = getEnv('ADMIN_USERNAME');
  const adminPassword = getEnv('ADMIN_PASSWORD');
  const jwtSecret = getEnv('NEXTAUTH_SECRET');

  if (username === adminUser && password === adminPassword) {
    const token = jwt.sign(
      {
        username: adminUser,
        role: 'admin',
        email: 'admin@estampanda.com'
      },
      jwtSecret,
      { expiresIn: '7d' }
    );
    
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });
    
    return { success: true, user: { username: adminUser, role: 'admin' } };
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
    
    const decoded = jwt.verify(token.value, getEnv('NEXTAUTH_SECRET'));
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