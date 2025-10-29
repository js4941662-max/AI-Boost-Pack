
import React from 'react';

interface ReportDisplayProps {
  markdownContent: string;
}

// A simple but effective markdown-to-JSX parser for this specific use case
const renderMarkdown = (markdown: string) => {
  const lines = markdown.split('\n');
  const elements = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Headings
    if (line.startsWith('### ')) {
      if (inList) { elements.push(</ul>); inList = false; }
      elements.push(<h3 key={i} className="text-lg font-bold text-purple-400 mt-6 mb-2">{line.substring(4)}</h3>);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { elements.push(</ul>); inList = false; }
      elements.push(<h2 key={i} className="text-2xl font-bold text-cyan-400 mt-8 mb-4 pb-2 border-b border-slate-700">{line.substring(3)}</h2>);
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { elements.push(</ul>); inList = false; }
      elements.push(<h1 key={i} className="text-3xl font-black text-white mt-4 mb-6">{line.substring(2)}</h1>);
      continue;
    }

    // Horizontal Rule
    if (line.startsWith('---')) {
      if (inList) { elements.push(</ul>); inList = false; }
      elements.push(<hr key={i} className="my-6 border-slate-700" />);
      continue;
    }

    // List items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        elements.push(<ul key={`ul-${i}`} className="list-disc list-inside space-y-2 mb-4 pl-4 text-slate-300"></ul>);
        inList = true;
      }
      // Get the current ul and add li to it
      const listContent = line.substring(2);
      const lastElement = elements[elements.length - 1];
      if (lastElement && lastElement.type === 'ul') {
          const newProps = {...lastElement.props, children: [...(lastElement.props.children || []), <li key={i} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(listContent) }} />]}
          elements[elements.length - 1] = React.cloneElement(lastElement, newProps);
      }
      continue;
    }
    
    // If we are out of a list
    if (inList) {
      inList = false;
    }
    
    // Paragraphs
    if (line.trim().length > 0) {
      elements.push(<p key={i} className="text-slate-300 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(line) }}></p>);
    }
  }

  return elements;
};

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


export const ReportDisplay: React.FC<ReportDisplayProps> = ({ markdownContent }) => {
  return (
    <div className="mt-8 md:mt-12">
        <div className="p-6 md:p-10 glass-card rounded-2xl">
            {renderMarkdown(markdownContent)}
        </div>
    </div>
  );
};
