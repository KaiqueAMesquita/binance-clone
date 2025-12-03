import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/AuthService';

// Mock apiClient used by AuthService
vi.mock('@/services/apiClient', () => ({
  apiClient: {
    post: vi.fn(async (url: string, body: any) => ({ data: { token: 't', user: { id: 2, name: 'u', email: body.email } } })),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('login stores token and user in localStorage and returns data', async () => {
    const res = await authService.login('x@y.com', 'pwd');
    expect(res.token).toBe('t');
    expect(localStorage.getItem('token')).toBe('t');
    expect(JSON.parse(localStorage.getItem('user') || '{}').email).toBe('x@y.com');
  });

  it('logout clears localStorage', () => {
    localStorage.setItem('token', 't');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    authService.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('getCurrentUser and isAuthenticated work', async () => {
    localStorage.setItem('token', 't2');
    localStorage.setItem('user', JSON.stringify({ id: 5, name: 'n' }));
    expect(authService.isAuthenticated()).toBe(true);
    const user = authService.getCurrentUser();
    expect(user?.id).toBe(5);
  });
});
