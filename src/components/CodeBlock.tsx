import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={cn("relative group rounded-xl overflow-hidden bg-card/60 border border-border/50 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-border/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Terminal size={14} className="text-primary" />
          <span>powershell</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed text-blue-100">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-right pr-4 text-white/20 select-none text-xs">{i + 1}</span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
