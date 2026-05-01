import { createContext, useState, useEffect, useMemo } from 'react';

export const ThemeContext = createContext();


export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      return;
    }

    setTheme('dark');
  }, []);

  useEffect(() => {
    const isDark = theme === 'dark';
    localStorage.setItem('theme', theme);

    const html = document.documentElement;
    html.classList.toggle('dark', isDark);
    html.dataset.theme = theme;
    html.style.colorScheme = isDark ? 'dark' : 'light';
  }, [theme]);

  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const contextValue = useMemo(() => ({ isDark, theme, toggleTheme, setTheme }), [isDark, theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
