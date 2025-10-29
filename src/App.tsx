
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AnalyticsInput } from './components/AnalyticsInput';
import { ReportDisplay } from './components/ReportDisplay';
import { Loader } from './components/Loader';
import { ErrorDisplay } from './components/ErrorDisplay';
import { generateAnalyticsReport } from './services/geminiService';
import { SparklesIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (imageDataUrl: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await generateAnalyticsReport(imageDataUrl);
      setReport(result);
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
        <AnalyticsInput 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading}
        />
        
        {isLoading && <Loader />}
        {error && <ErrorDisplay message={error} />}
        
        {report && (
          <ReportDisplay markdownContent={report} />
        )}

        {!isLoading && !error && !report && (
            <div className="text-center py-20 px-6 rounded-2xl glass-card">
                <div className="flex justify-center items-center mb-4">
                    <SparklesIcon className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Fix Your Engagement?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Upload a screenshot of your X Analytics page. The APEX system will perform a deep diagnosis and generate an elite, data-driven recovery plan to 10x your growth.
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
