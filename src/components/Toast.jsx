import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => onClose && onClose(), 3000);
    return () => clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  const base = 'fixed right-4 bottom-6 z-50 px-4 py-2 rounded shadow';
  const bg = type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white';

  return (
    <div className={`${base} ${bg}`} role="status">
      {message}
    </div>
  );
};

export default Toast;
