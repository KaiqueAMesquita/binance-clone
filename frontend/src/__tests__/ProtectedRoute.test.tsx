import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock next/navigation with a shared push mock so we can assert calls
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

// We'll mock authService to control authentication state
vi.mock('@/services/AuthService', () => ({
  authService: {
    isAuthenticated: vi.fn(),
  },
}));

import ProtectedRoute from '@/components/ProtectedRoute';
import { authService } from '@/services/AuthService';
import { useRouter } from 'next/navigation';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });
  it('redirects to login when not authenticated', () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    render(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>
    );
    expect(pushMock).toHaveBeenCalledWith('/users/login');
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    (authService.isAuthenticated as any).mockReturnValue(true);
    render(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Secret')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
