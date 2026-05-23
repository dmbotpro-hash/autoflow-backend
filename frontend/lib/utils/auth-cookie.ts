const TOKEN_COOKIE = 'token';
const MAX_AGE_DAYS = 7;

export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return;
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
