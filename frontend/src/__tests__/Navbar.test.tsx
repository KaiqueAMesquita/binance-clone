import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// Mock AuthContext so Navbar thinks user is authenticated
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, logout: vi.fn(), loading: false }),
}));

// Mock next/router used by Navbar
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import { ChatProvider, useChat } from '@/contexts/ChatContext';
import Navbar from '@/components/common/Navbar';

function StateConsumer() {
  const { isChatOpen } = useChat();
  return <div data-testid="chat-state">{isChatOpen ? 'open' : 'closed'}</div>;
}

describe('Navbar chat button', () => {
  it('toggles chat when chat button is clicked', () => {
    render(
      <ChatProvider>
        <StateConsumer />
        <Navbar />
      </ChatProvider>
    );

    const chatButton = screen.getByRole('button', { name: /Abrir chat/i });
    fireEvent.click(chatButton);

    expect(screen.getByTestId('chat-state').textContent).toBe('open');
  });
});
