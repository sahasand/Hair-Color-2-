import React, { useState } from 'react';
import type { AppState, ColorSuggestion } from './types';
import { getHairColorSuggestions, recolorHair } from './services/geminiService';
import { UploadScreen } from './components/UploadScreen';
import { EditorScreen } from './components/EditorScreen';
import { Loader } from './components/Loader';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('uploading');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [suggestedColors, setSuggestedColors] = useState<ColorSuggestion[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Analyzing your photo...');
    
    try {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = async (e) => {
        const fullDataUrl = e.target?.result as string;
        if (!fullDataUrl) {
            throw new Error("Failed to read file.");
        }
        setOriginalImageSrc(fullDataUrl);
        setImageSrc(fullDataUrl);
        
        const base64Data = fullDataUrl.split(',')[1];
        
        const suggestions = await getHairColorSuggestions(base64Data);
        
        // Re-rank suggestions based on skin tone harmony
        const harmonyOrder: Record<ColorSuggestion['harmony'], number> = { 'excellent': 1, 'good': 2, 'neutral': 3 };
        const sortedSuggestions = [...suggestions].sort((a, b) => {
            const orderA = harmonyOrder[a.harmony] || 99;
            const orderB = harmonyOrder[b.harmony] || 99;
            return orderA - orderB;
        });

        setSuggestedColors(sortedSuggestions);
        setAppState('editing');
        setIsLoading(false);
      };
       fileReader.onerror = () => {
         throw new Error("Error reading the uploaded file.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setIsLoading(false);
      handleReset();
    }
  };

  const handleColorSelection = async (hex: string | null) => {
    if (!originalImageSrc) return;

    // Reset to original image
    if (hex === null) {
      setImageSrc(originalImageSrc);
      setSelectedColor(null);
      return;
    }

    setIsLoading(true);
    setLoadingMessage("Applying new color...");
    setError(null);
    setSelectedColor(hex);

    try {
      const base64Data = originalImageSrc.split(',')[1];
      const newImageBase64 = await recolorHair(base64Data, hex);
      setImageSrc(`data:image/png;base64,${newImageBase64}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not apply the color.";
      setError(errorMessage);
      // Revert to original image on error
      setImageSrc(originalImageSrc);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
      setAppState('uploading');
      setImageSrc(null);
      setOriginalImageSrc(null);
      setSuggestedColors([]);
      setSelectedColor(null);
      setError(null);
      setIsLoading(false);
  }

  return (
    <div className="h-screen w-screen bg-neutral-50 text-neutral-800 overflow-hidden antialiased">
      {isLoading && <Loader message={loadingMessage} />}
      
      {appState === 'uploading' && <UploadScreen onImageUpload={handleImageUpload} error={error} />}

      {appState === 'editing' && imageSrc && originalImageSrc && (
        <EditorScreen
          imageSrc={imageSrc}
          originalImageSrc={originalImageSrc}
          aiSuggestions={suggestedColors}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelection}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
