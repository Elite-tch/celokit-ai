// components/CodeBlock.js
'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, Maximize2, Eye } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { parseLanguage } from '../../../lib/code-utils';

// Language support mapping
const SUPPORTED_LANGUAGES = {
  javascript: true,
  typescript: true,
  python: true,
  bash: true,
  shell: true,
  json: true,
  yaml: true,
  html: true,
  css: true,
  solidity: true,
  rust: true,
  go: true,
  java: true,
  cpp: true,
  csharp: true,
  kotlin: true,
  ruby: true,
  php: true,
  sql: true,
  markdown: true,
  // Add more as needed
};

export default function CodeBlock({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('javascript');

  useEffect(() => {
    // Normalize and validate the language
    const normalizedLang = parseLanguage(language);
    setDetectedLanguage(
      SUPPORTED_LANGUAGES[normalizedLang] ? normalizedLang : 'javascript'
    );
  }, [language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isLongCode = code.split('\n').length > 15;
  const showExpandControls = isLongCode && !isExpanded;

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 group">
      {/* Header with language and actions */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300 font-mono">
          {detectedLanguage}
        </span>
        <div className="flex items-center gap-2">
          {isLongCode && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              aria-label={isExpanded ? 'Collapse code' : 'Expand code'}
            >
              <Maximize2 size={12} />
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code content with syntax highlighting */}
      <div className={`${isExpanded ? 'max-h-none' : 'max-h-96'} overflow-auto`}>
        <Highlight
          theme={themes.vsDark}
          code={code}
          language={detectedLanguage}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 text-sm`}
              style={{ ...style, backgroundColor: 'transparent' }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="select-none text-gray-500 w-8 inline-block mr-2">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      {/* Expand overlay for long code */}
      {showExpandControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-20 flex items-end justify-center pb-2 pointer-events-none">
          <button
            onClick={() => setIsExpanded(true)}
            className="pointer-events-auto flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-lg"
            aria-label="View full code"
          >
            <Eye size={14} />
            View Full Code
          </button>
        </div>
      )}
    </div>
  );
}