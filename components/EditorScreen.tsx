import React from 'react';
import type { ColorSuggestion } from '../types';
import { ColorPalette } from './ColorPalette';
import { Icon } from './Icon';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface EditorScreenProps {
  imageSrc: string;
  originalImageSrc: string;
  aiSuggestions: ColorSuggestion[];
  selectedColor: string | null;
  onColorSelect: (hex: string | null) => void;
  onReset: () => void;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({ imageSrc, originalImageSrc, aiSuggestions, selectedColor, onColorSelect, onReset }) => {
  
  const handleSaveImage = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'ai-hair-color.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <header className="absolute top-0 left-0 right-0 z-10 flex justify-between p-4">
        <button onClick={onReset} className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md text-neutral-800 hover:bg-white transition-colors">
          <Icon name="back" className="w-5 h-5" />
        </button>
        {selectedColor && (
            <div className="flex items-center space-x-2">
                <button onClick={handleSaveImage} className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md text-neutral-800 hover:bg-white transition-colors">
                  <Icon name="save" className="w-5 h-5" />
                </button>
                <button onClick={() => onColorSelect(null)} className="w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-md text-neutral-800 hover:bg-white transition-colors">
                  <Icon name="reset" className="w-5 h-5" />
                </button>
            </div>
        )}
      </header>

      <main className="flex-grow flex items-center justify-center overflow-hidden relative">
        {selectedColor ? (
            <BeforeAfterSlider 
                key={imageSrc}
                beforeSrc={originalImageSrc} 
                afterSrc={imageSrc} 
                className="animate-fadeIn"
            />
        ) : (
            <img 
                key={imageSrc}
                src={imageSrc} 
                alt="User upload" 
                className="max-w-full max-h-full object-contain animate-fadeIn" 
            />
        )}
      </main>

      <footer className="w-full">
        <ColorPalette 
          aiSuggestions={aiSuggestions}
          selectedColor={selectedColor}
          onColorSelect={onColorSelect}
        />
      </footer>
    </div>
  );
};