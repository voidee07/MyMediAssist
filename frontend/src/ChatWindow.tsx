import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from './ChatContext';

const ChatWindow: React.FC = () => {
  const { messages, isTyping, currentSessionId, addUserMessage, addAssistantMessage, setTyping, refreshSessions } = useContext(ChatContext);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handlePresetClick = async (query: string) => {
    addUserMessage(query);
    setTyping(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': currentSessionId,
        },
        body: JSON.stringify({ message: query }),
      });
      const data = await response.json();
      if (data.success !== false && data.content) {
        addAssistantMessage(data.content);
      } else if (data.message) {
        addAssistantMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      addAssistantMessage('Sorry, a connection error occurred.');
    } finally {
      setTyping(false);
      refreshSessions();
    }
  };

  const renderContent = (content: string) => {
    // Simple formatter for line breaks and bold tags
    return content.split('\n').map((line, i) => {
      let element = line;
      // Replace markdown bold **text** with HTML bold
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-semibold text-gray-950 dark:text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-1 text-sm md:text-base leading-relaxed'}>
          {parts.length > 0 ? parts : element}
        </p>
      );
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center max-w-5xl self-center px-6 py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          MediGenius Clinical Assistant
        </h2>
        <p className="mt-3 text-sm md:text-base text-gray-550 dark:text-gray-400 max-w-xl">
          Consult our medical knowledge base, check symptoms, or research drug mechanisms.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 w-full max-w-5xl">
          <button
            onClick={() => handlePresetClick('What are the symptoms and stages of Hypertension?')}
            className="flex flex-col items-center justify-center min-h-[130px] p-6 text-center border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-600 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Symptoms</span>
            <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-normal">"What are the symptoms and stages of Hypertension?"</span>
          </button>

          <button
            onClick={() => handlePresetClick('What is the mechanism of action of Ibuprofen?')}
            className="flex flex-col items-center justify-center min-h-[130px] p-6 text-center border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-600 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Pharmacology</span>
            <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-normal">"What is the mechanism of action of Ibuprofen?"</span>
          </button>

          <button
            onClick={() => handlePresetClick('Search the medical book for Asthma treatment guidelines.')}
            className="flex flex-col items-center justify-center min-h-[130px] p-6 text-center border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-600 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Textbook Search</span>
            <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-normal">"Search the medical book for Asthma treatment guidelines."</span>
          </button>

          <button
            onClick={() => handlePresetClick('Explain the difference between Type 1 and Type 2 Diabetes.')}
            className="flex flex-col items-center justify-center min-h-[130px] p-6 text-center border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-600 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Endocrinology</span>
            <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200 leading-normal">"Explain the difference between Type 1 and Type 2 Diabetes."</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl self-center px-6 py-6 overflow-y-auto space-y-6 flex flex-col">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-4 w-full ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {/* Avatar for Assistant */}
          {msg.role !== 'user' && (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
          )}

          {/* Bubble */}
          <div
            className={`px-5 py-4 rounded-2xl shadow-sm text-gray-800 dark:text-gray-100 max-w-[85%] ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none'
                : 'bg-gray-105 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-tl-none'
            }`}
          >
            {msg.role === 'user' ? (
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                {renderContent(msg.content)}
              </div>
            )}
          </div>

          {/* Avatar for User */}
          {msg.role === 'user' && (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-emerald-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="flex items-start gap-4 justify-start w-full">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          {/* Typing dots */}
          <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-gray-105 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 flex items-center space-x-1.5 h-[44px]">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
