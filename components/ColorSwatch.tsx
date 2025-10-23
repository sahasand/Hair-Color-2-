import React, { forwardRef } from 'react';
import type { ColorSuggestion } from '../types';

interface ColorSwatchProps {
  hex: string;
  name: string;
  harmony: ColorSuggestion['harmony'];
  isSelected: boolean;
  onClick: () => void;
}

export const ColorSwatch = forwardRef<HTMLDivElement, ColorSwatchProps>(({ hex, name, harmony, isSelected, onClick }, ref) => {
  return (
    <div 
      ref={ref}
      className="flex flex-col items-center flex-shrink-0 cursor-pointer group transition-transform duration-200 ease-in-out"
      onClick={onClick}
      style={{ transform: isSelected ? 'scale(1.1)' : 'scale(1)' }}
    >
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 relative ${isSelected ? 'ring-2 ring-offset-2 ring-neutral-800' : 'ring-1 ring-neutral-200 hover:ring-neutral-400'}`}
        style={{ backgroundColor: hex }}
      >
      </div>
      <span className={`mt-3 text-xs text-center transition-colors duration-200 w-20 truncate ${isSelected ? 'text-neutral-800 font-medium' : 'text-neutral-500 group-hover:text-neutral-700'}`}>
        {name}
      </span>
    </div>
  );
});