import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatProvider, useChat } from '@/contexts/ChatContext';

function Consumer() {
  const { isChatOpen, toggleChat } = useChat();
  return (
    <div>
      <span data-testid="state">{isChatOpen ? 'open' : 'closed'}</span>
      <button onClick={toggleChat}>toggle</button>
    </div>
  );
}

describe('ChatContext', () => {
  it('toggles isChatOpen when toggleChat is called', () => {
    render(
      <ChatProvider>
        <Consumer />
      </ChatProvider>
    );

    expect(screen.getByTestId('state').textContent).toBe('closed');
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('state').textContent).toBe('open');
  });
});
