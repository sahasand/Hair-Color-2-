
import React, { useRef, useState } from 'react';
import { Icon } from './Icon';

interface UploadScreenProps {
  onImageUpload: (file: File) => void;
  error: string | null;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onImageUpload, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onImageUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-50 text-center">
      <h1 className="text-3xl font-light text-neutral-800">AI Hair Colorist</h1>
      <p className="mt-2 text-neutral-500 max-w-sm">
        Discover your perfect hair color. Upload a clear, well-lit photo of yourself to begin.
      </p>
      
      <div
        onClick={handleClick}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
        className={`mt-8 w-full max-w-md h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-neutral-800 bg-neutral-100' : 'border-neutral-300 hover:border-neutral-500 hover:bg-white'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg, image/png"
        />
        <Icon name="upload" className="w-10 h-10 text-neutral-400" />
        <p className="mt-4 text-neutral-600">
          Tap to upload or drag & drop an image
        </p>
        <p className="text-xs text-neutral-400 mt-1">PNG or JPG</p>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-300 text-red-800 text-sm p-3 rounded-lg max-w-md">
          <p className="font-semibold">An error occurred</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
