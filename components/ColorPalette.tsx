import React, { useState, useRef, useEffect } from 'react';
import type { ColorSuggestion } from '../types';
import { ColorSwatch } from './ColorSwatch';
import { Icon } from './Icon';
import { NATURAL_COLORS } from '../constants';

interface ColorPaletteProps {
  aiSuggestions: ColorSuggestion[];
  selectedColor: string | null;
  onColorSelect: (hex: string | null) => void;
}

type PaletteType = 'natural' | 'ai';

export const ColorPalette: React.FC<ColorPaletteProps> = ({ aiSuggestions, selectedColor, onColorSelect }) => {
  const [activePalette, setActivePalette] = useState<PaletteType>('ai');
  const swatchRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    if (selectedColor) {
      const swatchEl = swatchRefs.current.get(selectedColor);
      swatchEl?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedColor, activePalette]); // Re-run if selection or palette itself changes

  const renderPalette = (colors: ColorSuggestion[]) => (
    <div className="flex items-center space-x-6 px-6 py-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {colors.map((color) => (
        <ColorSwatch
          key={color.hex}
          ref={(el) => {
            if (el) {
              swatchRefs.current.set(color.hex, el);
            } else {
              swatchRefs.current.delete(color.hex);
            }
          }}
          hex={color.hex}
          name={color.name}
          harmony={color.harmony}
          isSelected={selectedColor === color.hex}
          onClick={() => onColorSelect(color.hex)}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full bg-neutral-100/90 backdrop-blur-lg pt-4">
      <div className="flex justify-center mb-2">
        <div className="bg-neutral-200/60 p-1 rounded-full flex items-center space-x-1">
            <button
                onClick={() => setActivePalette('ai')}
                className={`flex items-center px-4 py-1.5 text-sm transition-all duration-300 rounded-full ${activePalette === 'ai' ? 'bg-white shadow text-neutral-900 font-medium' : 'text-neutral-500 hover:bg-neutral-200/50'}`}
            >
                <Icon name="sparkles" className="w-4 h-4 mr-2" />
                AI Suggestions
            </button>
            <button
                onClick={() => setActivePalette('natural')}
                className={`px-4 py-1.5 text-sm transition-all duration-300 rounded-full ${activePalette === 'natural' ? 'bg-white shadow text-neutral-900 font-medium' : 'text-neutral-500 hover:bg-neutral-200/50'}`}
            >
                Natural Tones
            </button>
        </div>
      </div>
      <div>
        {activePalette === 'ai' ? renderPalette(aiSuggestions) : renderPalette(NATURAL_COLORS)}
      </div>
    </div>
  );
};