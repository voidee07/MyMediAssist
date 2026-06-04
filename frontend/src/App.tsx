import React, { useContext, useState } from 'react';
import { ThemeProvider, ThemeContext } from './ThemeProvider';
import { ChatProvider, ChatContext } from './ChatContext';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';

const AppContent: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { 
    sessions, 
    currentSessionId, 
    createNewChat, 
    loadSession, 
    deleteSession 
  } = useContext(ChatContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Sidebar - Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 dark:border-gray-900 bg-white dark:bg-slate-900/90 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">MediAssist</span>
          </div>
          
          {/* Close Sidebar Button (Mobile only) */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Session Button */}
        <div className="p-4">
          <button
            onClick={() => {
              createNewChat();
              setSidebarOpen(false);
            }}
            className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-[0.98] transition-all duration-150 cursor-pointer text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Consultation
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2 py-3">
          <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-550 uppercase tracking-wider mb-3 mt-1">
            History
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-500">
              No previous consults
            </div>
          ) : (
            sessions.map((sess) => {
              const isActive = sess.session_id === currentSessionId;
              return (
                <div
                  key={sess.session_id}
                  className={`group relative flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/50' 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-800/60 text-gray-600 dark:text-gray-400 border border-transparent'
                  }`}
                  onClick={() => {
                    loadSession(sess.session_id);
                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden w-full pr-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-550">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 11-1.25 0 .625.625 0 011.25 0zm4.5 0a.625.625 0 11-1.25 0 .625.625 0 011.25 0zm4.5 0a.625.625 0 11-1.25 0 .625.625 0 011.25 0zM12 20.25a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" />
                    </svg>
                    <span className="truncate text-xs md:text-sm font-medium">
                      {sess.preview || 'Untitled Consultation'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(sess.session_id);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-md transition-all duration-150 cursor-pointer"
                    title="Delete Chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-slate-900/40">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-xl transition-all duration-150 cursor-pointer text-sm font-medium border border-transparent hover:border-gray-200/50 dark:hover:border-slate-700/50"
          >
            <div className="flex items-center gap-2">
              {darkMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              )}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-550 bg-gray-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded">Tab</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 dark:bg-slate-950">
        {/* Workspace Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-900 bg-white dark:bg-slate-900/40 backdrop-blur-md px-6 z-10">
          <div className="flex w-full max-w-5xl mx-auto items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle (Mobile only) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Clinical Consult Agent
                  <span className="inline-flex items-center shrink-0 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                    Active
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-xs text-gray-450 dark:text-gray-500 font-medium">
                Source: Medical Library
              </span>
            </div>
          </div>
        </header>

        {/* Chat Feed */}
        <main className="flex-1 overflow-hidden flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950">
          <ChatWindow />
          <MessageInput />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
