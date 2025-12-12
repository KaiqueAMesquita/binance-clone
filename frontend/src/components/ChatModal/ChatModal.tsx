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
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
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
    const textToSend = input.trim();
    setInput('');
    sendToApi(textToSend);
  };

  const formatAnalysis = (res: any) => {
    try {
      const parts: string[] = [];
      if (res.sentiment) {
        const s = res.sentiment;
        if (typeof s === 'object') {
          parts.push(`Sentimento: ${s.label ?? s[0] ?? ''} ${s.score ? `(${s.score})` : ''}`);
        } else {
          parts.push(`Sentimento: ${String(s)}`);
        }
      }
      if (res.syntax_analysis?.entities?.length) {
        const ents = res.syntax_analysis.entities.map((e: any) => Array.isArray(e) ? `${e[0]}:${e[1]}` : String(e)).join(', ');
        parts.push(`Entidades: ${ents}`);
      }
      if (res.tfidf_features) {
        const len = Array.isArray(res.tfidf_features[0]) ? res.tfidf_features[0].length : (res.tfidf_features.length || 0);
        parts.push(`TF-IDF features: ${len} dims`);
      }
      if (!parts.length) return JSON.stringify(res, null, 2);
      return parts.join('\n');
    } catch (err) {
      return JSON.stringify(res, null, 2);
    }
  };

  const sendToApi = async (text: string) => {
    const CHAT_API = process.env.NEXT_PUBLIC_CHATBOT_API ?? 'http://127.0.0.1:5000';
    setSending(true);
    try {
      const resp = await fetch(`${CHAT_API.replace(/\/$/, '')}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        const errMsg = `Erro na API: ${resp.status} ${txt}`;
        const botErr: Message = { id: Date.now() + 2, text: errMsg, sender: 'bot' };
        setMessages((m) => [...m, botErr]);
        return;
      }
      const data = await resp.json();
      const botText = data.reply ? String(data.reply) : formatAnalysis(data);
      const botMsg: Message = { id: Date.now() + 2, text: botText, sender: 'bot' };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      const botErr: Message = { id: Date.now() + 2, text: `Erro de conexão: ${err?.message ?? String(err)}`, sender: 'bot' };
      setMessages((m) => [...m, botErr]);
    } finally {
      setSending(false);
    }
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
          disabled={sending}
        />
        <button className={styles.sendButton} onClick={handleSend} aria-label="Enviar" disabled={sending}>
          <IoSend size={18} />
        </button>
      </div>
    </div>
  );
}
