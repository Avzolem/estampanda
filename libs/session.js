import { cookies } from 'next/headers';

const SESSION_COOKIE = 'cart-session-id';

/**
 * Lee la cookie de sesión. Si no existe la crea (fallback al middleware).
 */
export async function getOrCreateSession() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  }

  return sessionId;
}

/**
 * Lee la cookie de sesión sin crearla. Devuelve null si no existe.
 */
export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
