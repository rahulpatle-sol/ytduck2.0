// lib/rateLimit.ts
const rateMap = new Map<string, { count: number; last: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const user = rateMap.get(ip) || { count: 0, last: now };

  if (now - user.last > windowMs) {
    user.count = 0;
    user.last = now;
  }

  user.count++;
  rateMap.set(ip, user);

  if (user.count > limit) return false;
  return true;
}
