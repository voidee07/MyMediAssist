import React, { useState, useContext } from 'react';
import { ChatContext } from './ChatContext';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { addUserMessage, addAssistantMessage, setTyping } = useContext(ChatContext);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    addUserMessage(userMsg);
    setInput('');
    setTyping(true);
    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      addAssistantMessage('Sorry, an error occurred.');
    } finally {
      setTyping(false);
    }
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-2xl flex space-x-2 mt-2">
      <input
        type="text"
        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Type your message…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={onKeyPress}
      />
      <button
        className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
