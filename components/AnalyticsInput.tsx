
import React, { useState, useRef, useCallback } from 'react';
import { BrainCircuitIcon, UploadIcon } from './icons/Icons';
import { EXAMPLE_IMAGE_DATA_URL } from '../exampleData';

interface TweetInputProps {
  onAnalyze: (imageDataUrl: string) => void;
  isLoading: boolean;
}

export const TweetInput: React.FC<TweetInputProps> = ({ onAnalyze, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleLoadExampleClick = useCallback(() => {
    if (isLoading) return;
    setImagePreview(EXAMPLE_IMAGE_DATA_URL);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    // Directly trigger analysis with the example data
    onAnalyze(EXAMPLE_IMAGE_DATA_URL);
  }, [isLoading, onAnalyze]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePreview && !isLoading) {
      onAnalyze(imagePreview);
    }
  };
  
  const canAnalyze = (imagePreview !== null) && !isLoading;

  return (
    <div className="max-w-3xl mx-auto mb-8 md:mb-12">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 glass-card rounded-2xl shadow-2xl shadow-slate-950/50">
        
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-400">
            Upload Tweet Screenshot
          </label>
          <button 
            type="button"
            onClick={handleLoadExampleClick}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            Load Example
          </button>
        </div>

        <div className="w-full aspect-video bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="Tweet preview" className="object-contain h-full w-full" />
          ) : (
             <div className="text-center text-slate-500 pointer-events-none">
                <UploadIcon className="w-8 h-8 mx-auto mb-2"/>
                <p>Upload or drop an image</p>
                <p className="text-xs">PNG, JPG, or GIF</p>
             </div>
          )}
           <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
        </div>

        <button
          type="submit"
          disabled={!canAnalyze}
          className="w-full flex items-center justify-center gap-3 text-white font-bold py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100 group"
        >
          <BrainCircuitIcon className="w-5 h-5 transition-transform group-hover:rotate-6" />
          {isLoading ? 'Generating Replies...' : 'Generate Reply Suggestions'}
        </button>
      </form>
    </div>
  );
};
