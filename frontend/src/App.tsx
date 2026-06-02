import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ChatProvider } from './ChatContext';
import Header from './Header';
import Footer from './Footer';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto" id="app">
            <ChatWindow />
            <MessageInput />
          </main>
          <Footer />
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
