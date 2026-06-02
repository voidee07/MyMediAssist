import React, { useContext } from 'react';
import { ChatContext } from './ChatContext';

const ChatWindow: React.FC = () => {
  const { messages, isTyping } = useContext(ChatContext);

  return (
    <div className="w-full max-w-2xl space-y-4 mb-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-lg max-w-full ${msg.role === 'user' ? 'bg-primary text-white self-end' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 self-start'}`}
        >
          {msg.content}
        </div>
      ))}
      {isTyping && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="animate-pulse inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
          <span>Assistant is typing...</span>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
