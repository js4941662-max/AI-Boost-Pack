import React, { useState } from 'react';
import { CheckIcon, ClipboardIcon } from './icons/Icons';

interface ReportDisplayProps {
  markdownContent: string;
}

const processInlineMarkdown = (text: string) => {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    // Emojis with special coloring
    text = text.replace(/(✅)/g, '<span class="text-green-400 mr-2">$1</span>');
    text = text.replace(/(❌)/g, '<span class="text-red-400 mr-2">$1</span>');
    text = text.replace(/(🚩)/g, '<span class="text-yellow-400 mr-2">$1</span>');
    text = text.replace(/(🚨)/g, '<span class="text-red-500 mr-2">$1</span>');
    // Code blocks (simple inline)
    text = text.replace(/`(.*?)`/g, '<code class="bg-slate-800 text-cyan-400 text-sm font-mono px-2 py-1 rounded-md">$1</code>');
    return text;
}

const renderMarkdown = (markdown: string) => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 pl-4 text-slate-300">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      listItems.push(<li key={index} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(trimmedLine.substring(2)) }} />);
    } else {
      flushList(); // End the list if we encounter a non-list item
      
      if (line.startsWith('### ')) {
        elements.push(<h3 key={index} className="text-lg font-bold text-purple-400 mt-6 mb-2">{line.substring(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={index} className="text-2xl font-bold text-cyan-400 mt-8 mb-4 pb-2 border-b border-slate-700">{line.substring(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={index} className="text-3xl font-black text-white mt-4 mb-6">{line.substring(2)}</h1>);
      } else if (line.trim() === '---') {
        elements.push(<hr key={index} className="my-6 border-slate-700" />);
      } else if (line.trim().length > 0) {
        elements.push(<p key={index} className="text-slate-300 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(line) }}></p>);
      }
    }
  });

  flushList(); // Ensure any trailing list is added

  return elements;
};


export const ReportDisplay: React.FC<ReportDisplayProps> = ({ markdownContent }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <div className="mt-8 md:mt-12">
        <div className="relative p-6 md:p-10 glass-card rounded-2xl">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 rounded-md hover:bg-slate-700/80 transition-colors z-10"
              title="Copy report markdown"
            >
              {isCopied ? (
                <>
                  <CheckIcon className="w-4 h-4 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <ClipboardIcon className="w-4 h-4" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
            <div className="prose prose-invert max-w-none">
                {renderMarkdown(markdownContent)}
            </div>
        </div>
    </div>
  );
};
