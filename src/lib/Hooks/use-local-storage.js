import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Initialize state with initialValue or retrieve from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    }
    return initialValue; // Default to initialValue if on the server
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Retrieve from localStorage when the key changes
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    }
  }, [key]);

  const setValue = (value) => {
    if (typeof window !== 'undefined') {
      // Update state and save to localStorage
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue];
};
