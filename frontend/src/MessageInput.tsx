import React, { useState, useContext, useRef, useEffect } from 'react';
import { ChatContext } from './ChatContext';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { currentSessionId, addUserMessage, addAssistantMessage, setTyping, refreshSessions } = useContext(ChatContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    addUserMessage(userMsg);
    setInput('');
    setTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': currentSessionId,
        },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      if (data.success !== false && data.content) {
        addAssistantMessage(data.content);
      } else if (data.message) {
        addAssistantMessage(data.message);
      }
    } catch (err) {
      console.error('Chat error:', err);
      addAssistantMessage('Sorry, a connection error occurred with the medical AI assistant.');
    } finally {
      setTyping(false);
      refreshSessions();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-5xl self-center px-6 pb-4">
      <div className="relative flex flex-col w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80 shadow-md focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all duration-200">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Describe symptoms, ask about medications, or search medical books..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-16 pr-14 pt-4 pb-12 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-450 dark:placeholder-gray-500 focus:outline-none resize-none min-h-[52px] leading-relaxed text-sm md:text-base"
        />
        
        <div className="absolute bottom-3 left-4 flex items-center space-x-2">
          {/* Mock Action Buttons to look like a premium chat platform */}
          <button 
            type="button" 
            className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer"
            title="Attach health records"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.625-13.624l-9.449 9.449a1.5 1.5 0 102.122 2.122l9.585-9.585" />
            </svg>
          </button>
          <button 
            type="button" 
            className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer"
            title="Voice input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`absolute bottom-3 right-3 p-2 rounded-xl text-white transition-all duration-200 ${
            input.trim() 
              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-sm cursor-pointer scale-100' 
              : 'bg-gray-300 dark:bg-gray-700 text-gray-400 dark:text-gray-550 cursor-not-allowed scale-95'
          }`}
          title="Send message"
        >
          <svg xmlns="http://www.w3.org/255/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
      <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-2 px-4 leading-normal">
        MediGenius provides medical AI information based on indexed medical books. Always consult a healthcare professional for clinical decisions.
      </p>
    </div>
  );
};

export default MessageInput;
