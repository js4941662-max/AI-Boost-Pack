import React, { useState, useEffect } from 'react';
import { ApexLogo } from './icons/Icons';

const loadingMessages = [
  "Analyzing analytics screenshot...",
  "Identifying performance bottlenecks...",
  "Cross-referencing with algorithmic behavior models...",
  "Formulating data-driven recovery protocol...",
  "Finalizing your strategic growth plan..."
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="text-center py-16">
      <div className="flex justify-center items-center mb-6">
        <ApexLogo className="w-16 h-16 text-blue-500 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Generating Diagnosis...</h2>
      <p className="text-slate-400 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
