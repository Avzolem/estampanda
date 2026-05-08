/**
 * Rate limit in-memory simple. Map<key, [timestamps]>.
 * Cada timestamp = ms en que ocurrió un hit.
 * Limpia entradas expiradas en cada check.
 *
 * NOTA: solo funciona en single-instance. Para multi-region en Vercel,
 * migrar a Upstash Redis. TODO: distributed rate limit.
 */

const buckets = new Map();

export function checkRateLimit(key, maxHits, windowSeconds) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  const hits = buckets.get(key) ?? [];
  const recent = hits.filter((t) => t > windowStart);

  if (recent.length >= maxHits) {
    buckets.set(key, recent);
    return { allowed: false, remaining: 0, resetAt: recent[0] + windowMs };
  }

  recent.push(now);
  buckets.set(key, recent);
  return { allowed: true, remaining: maxHits - recent.length, resetAt: now + windowMs };
}
