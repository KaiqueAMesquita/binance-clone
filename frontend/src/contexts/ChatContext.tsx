'use client';

import React, { createContext, useContext, useState } from 'react';

type ChatContextType = {
  isChatOpen: boolean;
  toggleChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen((s) => !s);

  return <ChatContext.Provider value={{ isChatOpen, toggleChat }}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export default ChatContext;
