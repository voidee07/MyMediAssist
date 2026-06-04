import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary dark:bg-primary-dark text-white py-4 shadow-md transition-colors duration-300">
      <h1 className="text-center text-2xl font-semibold">MediAssist Chat</h1>
    </header>
  );
};

export default Header;
