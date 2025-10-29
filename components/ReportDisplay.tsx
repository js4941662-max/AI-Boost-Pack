
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './icons/Icons';
import { ReplySuggestion } from '../types';

interface ReplySuggestionsProps {
  suggestions: ReplySuggestion[];
}

const StyleBadge: React.FC<{ style: string }> = ({ style }) => {
  const baseClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full";
  const styleMap: { [key: string]: string } = {
    'Insightful': 'bg-blue-900 text-blue-300',
    'Humorous': 'bg-purple-900 text-purple-300',
    'Question': 'bg-yellow-900 text-yellow-300',
    'Supportive': 'bg-green-900 text-green-300',
    'Professional': 'bg-gray-700 text-gray-300',
    'Sarcastic': 'bg-pink-900 text-pink-300',
    'Default': 'bg-slate-700 text-slate-300'
  };
  const colorClasses = styleMap[style] || styleMap['Default'];
  return <span className={`${baseClasses} ${colorClasses}`}>{style}</span>;
};


const SuggestionCard: React.FC<{ suggestion: ReplySuggestion }> = ({ suggestion }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col justify-between h-full hover:border-slate-600 transition-colors duration-200">
        <div>
            <div className="mb-3">
                <StyleBadge style={suggestion.style} />
            </div>
            <p className="text-slate-300 leading-relaxed">{suggestion.text}</p>
        </div>
        <div className="mt-4 flex justify-end">
            <button
                onClick={handleCopy}
                aria-label={`Copy reply: ${suggestion.text}`}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    copied
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
                {copied ? (
                    <>
                        <CheckIcon className="w-4 h-4" />
                        Copied
                    </>
                ) : (
                    <>
                        <ClipboardIcon className="w-4 h-4" />
                        Copy
                    </>
                )}
            </button>
        </div>
    </div>
  );
};


export const ReplySuggestions: React.FC<ReplySuggestionsProps> = ({ suggestions }) => {
  return (
    <div className="mt-8 md:mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">AI Generated Replies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} />
            ))}
        </div>
    </div>
  );
};
