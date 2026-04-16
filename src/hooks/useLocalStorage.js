import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error('localStorage error:', e);
    }
  };

  return [storedValue, setValue];
}

export function clearAllStorage() {
  const keys = ['vasaa_invoices', 'vasaa_employees', 'vasaa_salaries', 'vasaa_purchases', 'vasaa_bank_txns', 'vasaa_deliveries'];
  keys.forEach(k => localStorage.removeItem(k));
}
