'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './ChatModal.module.css';
import { FiX } from 'react-icons/fi';
import { IoSend } from 'react-icons/io5';
import { useChat } from '@/contexts/ChatContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatModal() {
  const { isChatOpen, toggleChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Olá! Sou o assistente virtual. Como posso ajudar?', sender: 'bot' },
    { id: 2, text: 'Você pode perguntar sobre seu saldo ou transações.', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isChatOpen && endRef.current && typeof (endRef.current as any).scrollIntoView === 'function') {
      (endRef.current as any).scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (endRef.current && typeof (endRef.current as any).scrollIntoView === 'function') {
      (endRef.current as any).scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: 'Recebi sua mensagem — em breve um agente real entrará em contato.',
        sender: 'bot',
      };
      setMessages((m) => [...m, botMsg]);
    }, 1500);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isChatOpen) return null;

  return (
    <div className={styles.container} role="dialog" aria-label="Chat Support">
      <div className={styles.header}>
        <div className={styles.title}>Suporte</div>
        <button className={styles.close} onClick={toggleChat} aria-label="Fechar">
          <FiX size={18} />
        </button>
      </div>

      <div className={styles.messages}>
        {messages.map((m) => (
          <div key={m.id} className={m.sender === 'user' ? styles.messageUser : styles.messageBot}>
            <div className={styles.messageText}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Escreva sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className={styles.sendButton} onClick={handleSend} aria-label="Enviar">
          <IoSend size={18} />
        </button>
      </div>
    </div>
  );
}
