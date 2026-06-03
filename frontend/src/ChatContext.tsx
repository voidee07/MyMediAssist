import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  session_id: string;
  preview: string;
  updated_at?: string;
}

interface ChatContextProps {
  messages: ChatMessage[];
  sessions: ChatSession[];
  currentSessionId: string;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  isTyping: boolean;
  setTyping: (typing: boolean) => void;
  createNewChat: () => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  refreshSessions: () => void;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const ChatContext = createContext<ChatContextProps>({
  messages: [],
  sessions: [],
  currentSessionId: '',
  addUserMessage: () => {},
  addAssistantMessage: () => {},
  isTyping: false,
  setTyping: () => {},
  createNewChat: () => {},
  loadSession: () => {},
  deleteSession: () => {},
  refreshSessions: () => {},
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Session ID
  useEffect(() => {
    let sessId = localStorage.getItem('medi_session_id');
    if (!sessId) {
      sessId = generateUUID();
      localStorage.setItem('medi_session_id', sessId);
    }
    setCurrentSessionId(sessId);
  }, []);

  // Fetch History when currentSessionId changes
  useEffect(() => {
    if (!currentSessionId) return;

    fetch('http://localhost:8000/api/v1/history', {
      headers: {
        'X-Session-ID': currentSessionId,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages.map((m: any) => ({ role: m.role, content: m.content })));
        } else {
          setMessages([]);
        }
      })
      .catch(console.error);

    refreshSessions();
  }, [currentSessionId]);

  const refreshSessions = () => {
    fetch('http://localhost:8000/api/v1/sessions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        }
      })
      .catch(console.error);
  };

  const createNewChat = () => {
    const newId = generateUUID();
    localStorage.setItem('medi_session_id', newId);
    setCurrentSessionId(newId);
    setMessages([]);
  };

  const loadSession = (sessionId: string) => {
    localStorage.setItem('medi_session_id', sessionId);
    setCurrentSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    fetch(`http://localhost:8000/api/v1/session/${sessionId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          refreshSessions();
          // If deleted session was the current one, start a new chat
          if (sessionId === currentSessionId) {
            createNewChat();
          }
        }
      })
      .catch(console.error);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: 'user', content }]);
  };

  const addAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: 'assistant', content }]);
    refreshSessions(); // Refresh previews after assistant responds
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sessions,
        currentSessionId,
        addUserMessage,
        addAssistantMessage,
        isTyping,
        setTyping: setIsTyping,
        createNewChat,
        loadSession,
        deleteSession,
        refreshSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
