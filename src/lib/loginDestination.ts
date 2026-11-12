function isHomePath(pathname: string) {
  const normalized = decodeURIComponent(pathname).replace(/\/+$/, '').toLowerCase();
  return normalized === '' || normalized === '/dashboard' || normalized === '/about';
}

const RETURN_KEY = 'eduaihub_login_destination';

/** Per-tab return destination only, never a browsing-history log. */
export function rememberLoginDestination() {
  try {
    const { pathname, search, hash } = window.location;
    if (isHomePath(pathname)) sessionStorage.removeItem(RETURN_KEY);
    else sessionStorage.setItem(RETURN_KEY, pathname + search + hash);
  } catch { /* Storage may be disabled; the existing dashboard callback still works. */ }
}
export function readLoginDestination() {
  try {
    const value = sessionStorage.getItem(RETURN_KEY);
    if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin || isHomePath(url.pathname)) return null;
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}
export function clearLoginDestination() {
  try { sessionStorage.removeItem(RETURN_KEY); } catch { /* Optional per-tab UI state. */ }
}
