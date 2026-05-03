import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import powershell from "react-syntax-highlighter/dist/esm/languages/prism/powershell";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import xml from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import ini from "react-syntax-highlighter/dist/esm/languages/prism/ini";

SyntaxHighlighter.registerLanguage("powershell", powershell);
SyntaxHighlighter.registerLanguage("ps1", powershell);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("sh", bash);
SyntaxHighlighter.registerLanguage("cmd", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("xml", xml);
SyntaxHighlighter.registerLanguage("html", xml);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("yml", yaml);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("cs", csharp);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("ini", ini);

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "powershell", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-[#0b0d14] relative group">
      {/* Subtle gradient halo on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: 'radial-gradient(800px 200px at 50% -10%, hsl(195 100% 60% / 0.08), transparent 60%)'
        }}
      />
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#1a1d2a] to-[#13161f] border-b border-white/5 relative">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner shadow-black/30" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-inner shadow-black/30" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-inner shadow-black/30" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 shrink-0 uppercase tracking-wider">
              {language === 'powershell' || language === 'ps1' ? 'ps' : language}
            </span>
            {title && (
              <span className="text-xs font-mono text-gray-300 truncate">{title}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all shrink-0"
          title={copied ? "Copiado!" : "Copiar código"}
          aria-label="Copiar código"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 text-sm font-mono overflow-x-auto bg-[#0b0d14] relative">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.6",
            fontFamily: "var(--font-mono)",
          }}
          codeTagProps={{
            style: { fontFamily: "var(--font-mono)" },
          }}
          wrapLines={true}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
