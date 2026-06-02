import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextProps {
  messages: ChatMessage[];
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  isTyping: boolean;
  setTyping: (typing: boolean) => void;
}

export const ChatContext = createContext<ChatContextProps>({
  messages: [],
  addUserMessage: () => {},
  addAssistantMessage: () => {},
  isTyping: false,
  setTyping: () => {},
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Load history on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages.map((m: any) => ({ role: m.role, content: m.content })));
        }
      })
      .catch(console.error);
  }, []);

  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: 'user', content }]);
  };

  const addAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: 'assistant', content }]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addUserMessage,
        addAssistantMessage,
        isTyping,
        setTyping: setIsTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
