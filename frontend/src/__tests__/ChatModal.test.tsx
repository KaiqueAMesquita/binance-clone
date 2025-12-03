import React, { useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import ChatModal from '@/components/ChatModal/ChatModal';

function OpenOnMount({ children }: { children: React.ReactNode }) {
  const { toggleChat } = useChat();
  useEffect(() => {
    toggleChat();
  }, [toggleChat]);
  return <>{children}</>;
}

describe('ChatModal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial mock messages and sends a message with bot reply', async () => {
    render(
      <ChatProvider>
        <OpenOnMount>
          <ChatModal />
        </OpenOnMount>
      </ChatProvider>
    );

    // initial messages
    expect(screen.getByText(/Olá! Sou o assistente virtual/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Escreva sua mensagem...');
    await userEvent.type(input, 'Teste de mensagem');

    const sendButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(sendButton);

    // user message should appear
    expect(await screen.findByText('Teste de mensagem')).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe('');

    // advance timers and expect bot reply
    vi.advanceTimersByTime(1500);
    expect(await screen.findByText(/Recebi sua mensagem/i)).toBeInTheDocument();
  });
});
