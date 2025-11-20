import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    // Background colors
    background: isDark ? '#000000' : '#F8F9FA',
    cardBackground: isDark ? '#1C1C1E' : '#FFFFFF',
    secondaryBackground: isDark ? '#2C2C2E' : '#F2F2F7',
    
    // Text colors
    text: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#8E8E93' : '#8E8E93',
    placeholderText: isDark ? '#636366' : '#C7C7CC',
    
    // Primary colors
    primary: isDark ? '#0A84FF' : '#007AFF',
    primaryLight: isDark ? '#1F8EFF' : '#0A84FF',
    
    // Status colors
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    
    // Border colors
    border: isDark ? '#38383A' : '#E5E5EA',
    
    // Message bubble colors
    myMessageBg: isDark ? '#0A84FF' : '#007AFF',
    otherMessageBg: isDark ? '#2C2C2E' : '#E9E9EB',
    myMessageText: '#FFFFFF',
    otherMessageText: isDark ? '#FFFFFF' : '#000000',
    
    // Shadow
    shadow: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
    
    // Overlay
    overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    
    // Glass effect
    glass: isDark ? 'rgba(28, 28, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    
    // Online status
    online: '#34C759',
    offline: isDark ? '#636366' : '#8E8E93',
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;