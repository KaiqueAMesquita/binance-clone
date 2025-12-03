import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the authService used by AuthContext
vi.mock('@/services/AuthService', () => ({
  authService: {
    login: vi.fn(async (email: string, password: string) => ({
      token: 'mock-token',
      user: { id: 1, name: 'mockuser', email },
    })),
    logout: vi.fn(),
    getCurrentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
  },
}));

import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function Consumer() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="state">{isAuthenticated ? 'auth' : 'no-auth'}</div>
      <div data-testid="user">{user?.name ?? 'no-user'}</div>
      <button onClick={() => login('a@b.com', 'pwd')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('performs login and logout flows', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('state').textContent).toBe('no-auth');
    fireEvent.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('state').textContent).toBe('auth'));
    expect(screen.getByTestId('user').textContent).toBe('mockuser');

    // logout
    fireEvent.click(screen.getByText('logout'));
    await waitFor(() => expect(screen.getByTestId('state').textContent).toBe('no-auth'));
  });
});
