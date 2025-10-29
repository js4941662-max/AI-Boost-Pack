
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TweetInput } from './components/AnalyticsInput';
import { ReplySuggestions } from './components/ReportDisplay';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateReplySuggestions } from './services/geminiService';
import { EXAMPLE_IMAGE_DATA_URL, EXAMPLE_REPLIES } from './exampleData';
import { BrainCircuitIcon } from './components/icons/Icons';
import type { ReplySuggestion } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ReplySuggestion[] | null>(null);

  const handleAnalyze = useCallback(async (imageDataUrl: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    // Use example data if the example image is provided to showcase functionality
    if (imageDataUrl === EXAMPLE_IMAGE_DATA_URL) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        const exampleData = JSON.parse(EXAMPLE_REPLIES);
        setSuggestions(exampleData.suggestions);
      } catch (e) {
        setError("Failed to parse example data.");
      }
      setIsLoading(false);
      return;
    }
    
    // Otherwise, call the real API
    try {
      const result = await generateReplySuggestions(imageDataUrl);
      const parsedResult = JSON.parse(result);
      if (parsedResult.suggestions && Array.isArray(parsedResult.suggestions)) {
          setSuggestions(parsedResult.suggestions);
      } else {
          throw new Error("AI response was not in the expected format. Please check the AI's output.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-slate-950 bg-pattern"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Header />
        <TweetInput 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading}
        />
        
        {isLoading && <Loader />}
        {error && <ErrorDisplay message={error} />}
        
        {suggestions && (
          <ReplySuggestions suggestions={suggestions} />
        )}

        {!isLoading && !error && !suggestions && (
            <div className="text-center py-20 px-6 rounded-2xl glass-card">
                <div className="flex justify-center items-center mb-4">
                    <BrainCircuitIcon className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Stuck on what to reply?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Upload a screenshot of any tweet. The APEX system will analyze the context and generate several high-quality reply options for you to use.
                </p>
            </div>
        )}
      </main>

      <footer className="text-center py-6 text-sm text-slate-500">
        <p>APEX X ULTIMATE SYSTEM © 2025. All Rights Reserved.</p>
        <p>Engineered for elite performance with a 99% confidence guarantee.</p>
      </footer>
    </div>
  );
};

export default App;