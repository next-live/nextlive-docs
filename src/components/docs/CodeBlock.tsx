
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({ code, language = 'tsx', showLineNumbers = true, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const lines = code.trim().split('\n');
  
  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between bg-doc-dark-bg px-4 py-2 text-white">
        <span className="text-xs font-mono">{language}</span>
        <button onClick={handleCopy} className="p-1 hover:bg-white/10 rounded">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      
      <div className="overflow-x-auto bg-doc-dark-bg text-white p-4 font-mono text-sm">
        <pre>
          {lines.map((line, i) => (
            <div key={i} className="table-row">
              {showLineNumbers && (
                <span className="table-cell pr-4 text-right select-none text-gray-500">
                  {i + 1}
                </span>
              )}
              <span className="table-cell">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
