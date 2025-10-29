import React, { useState, useEffect } from 'react';
import { ApexLogo } from './icons/Icons';

const loadingMessages = [
  "Analyzing tweet context...",
  "Considering multiple angles...",
  "Crafting witty and insightful responses...",
  "Checking for tone and clarity...",
  "Finalizing reply suggestions..."
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="text-center py-16">
      <div className="flex justify-center items-center mb-6">
        <ApexLogo className="w-16 h-16 text-blue-500 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Generating Replies...</h2>
      <p className="text-slate-400 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
