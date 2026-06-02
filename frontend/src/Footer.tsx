import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const Footer: React.FC = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <footer className="bg-primary dark:bg-primary-dark text-white py-3 flex justify-center items-center transition-colors duration-300">
      <button
        className="px-4 py-2 bg-white dark:bg-gray-800 text-primary dark:text-primary-dark rounded-md hover:opacity-90 transition-opacity"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </footer>
  );
};

export default Footer;
