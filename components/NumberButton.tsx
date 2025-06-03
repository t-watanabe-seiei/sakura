
import React from 'react';

interface NumberButtonProps {
  number: number;
  onClick: (num: number) => void;
  disabled?: boolean;
  selected?: boolean;
}

export const NumberButton: React.FC<NumberButtonProps> = ({ number, onClick, disabled, selected }) => {
  return (
    <button
      onClick={() => onClick(number)}
      disabled={disabled}
      className={`
        font-bold py-3 md:py-4 text-xl md:text-2xl rounded-lg transition-all duration-150 shadow
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 
          selected ? 'bg-pink-500 text-white ring-2 ring-pink-700 ring-offset-2 scale-105' : 
          'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 transform focus:ring-blue-400'
        }
      `}
    >
      {number}
    </button>
  );
};
