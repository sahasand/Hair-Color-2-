
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin"></div>
      <p className="mt-4 text-neutral-600 text-sm tracking-wider">{message}</p>
    </div>
  );
};
