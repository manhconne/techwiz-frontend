export function parseJwt(token: string): any {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function getAccessToken(): string {
  if (typeof window === 'undefined') return '';
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (match && match[1]) return decodeURIComponent(match[1]);
  return localStorage.getItem('access_token') || localStorage.getItem('token') || '';
}

export function checkIsAdmin(user?: any): boolean {
  if (typeof window === 'undefined') return false;

  const adminEmails = ['lumanhgioi.vn@gmail.com', 'admin@fanhubplus.com'];

  if (user) {
    if (user.role === 'admin' || user.role === 'Admin') return true;
    if (Array.isArray(user.roles) && user.roles.some((r: string) => String(r).toLowerCase() === 'admin')) return true;
    if (user.email && (adminEmails.includes(user.email.toLowerCase()) || user.email.toLowerCase().includes('admin'))) return true;
  }

  try {
    const saved = localStorage.getItem('kpop_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.role === 'admin' || parsed.role === 'Admin') return true;
      if (Array.isArray(parsed.roles) && parsed.roles.some((r: string) => String(r).toLowerCase() === 'admin')) return true;
      if (parsed.email && (adminEmails.includes(parsed.email.toLowerCase()) || parsed.email.toLowerCase().includes('admin'))) return true;
    }
  } catch { }

  const token = getAccessToken();
  if (token) {
    const payload = parseJwt(token);
    if (payload) {
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      const roleClaim =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload['role'] ||
        payload['roles'];
      if (Array.isArray(roleClaim)) {
        if (roleClaim.some((r: string) => String(r).toLowerCase() === 'admin')) return true;
      } else if (typeof roleClaim === 'string' && roleClaim.toLowerCase() === 'admin') {
        return true;
      }
    }
  }

  return false;
}
