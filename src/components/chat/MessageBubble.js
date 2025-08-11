'use client';
import { useState, useMemo } from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import CodeBlock from './CodeBlock';
import Image from 'next/image';

// Language aliases mapping
const LANGUAGE_ALIASES = {
  py: 'python',
  js: 'javascript',
  ts: 'typescript',
  rb: 'ruby',
  sh: 'bash',
  zsh: 'bash',
  kt: 'kotlin',
  rs: 'rust',
  go: 'golang',
  cs: 'csharp',
  fs: 'fsharp',
  m: 'objectivec',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  cc: 'cpp',
  hh: 'cpp'
};

export default function MessageBubble({ message, isUser, timestamp }) {
  const [copied, setCopied] = useState(false);

  // Parse message into parts (text, code blocks)
  const parseMessage = useMemo(() => {
    if (isUser) return [{ type: 'text', content: message }];

    const parts = [];
    let remainingText = message;
    let lastIndex = 0;

    // Enhanced code block detection with support for:
    // - Optional language identifier
    // - Different numbers of backticks (``` or ````)
    // - Spaces around language identifier
    const codeBlockRegex = /(`{3,})(\s*)([a-zA-Z0-9+\-#]*)\n([\s\S]*?)\1/g;
    let match;

    while ((match = codeBlockRegex.exec(message)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = message.slice(lastIndex, match.index).trim();
        if (textContent) {
          parts.push({ type: 'text', content: textContent });
        }
      }

      // Process code block
      const languageRaw = match[3].trim().toLowerCase();
      const language = LANGUAGE_ALIASES[languageRaw] || languageRaw || 'javascript';
      const code = match[4].trim();

      parts.push({
        type: 'code',
        content: code,
        language
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < message.length) {
      const textContent = message.slice(lastIndex).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: message }];
  }, [message, isUser]);

  // Format text with markdown-like styling
  const formatText = (text) => {
    return text.split('\n').map((line, lineIndex) => {
      if (!line.trim()) return <div key={`empty-${lineIndex}`} className="h-4" />;

      // Check for numbered lists (1., 2., etc.)
      const numberedListMatch = line.match(/^(\s*)(\d+)\.\s(.*)$/);
      if (numberedListMatch) {
        return (
          <div key={`num-${lineIndex}`} className="flex gap-2 mb-2">
            <span className="text-green-600 font-semibold min-w-[24px] flex-shrink-0">
              {numberedListMatch[2]}.
            </span>
            <span className="flex-1 min-w-0">
              {formatInlineText(numberedListMatch[3], `${lineIndex}-num`)}
            </span>
          </div>
        );
      }

      // Check for bullet points (*, -)
      const bulletListMatch = line.match(/^(\s*)([-*])\s(.*)$/);
      if (bulletListMatch) {
        return (
          <div 
            key={`bullet-${lineIndex}`} 
            className="flex gap-2 mb-1"
            style={{ marginLeft: `${Math.min(bulletListMatch[1].length * 8, 32)}px` }}
          >
            <span className="text-green-600 min-w-[16px] mt-1 flex-shrink-0">•</span>
            <span className="flex-1 min-w-0">
              {formatInlineText(bulletListMatch[3], `${lineIndex}-bullet`)}
            </span>
          </div>
        );
      }

      // Check for headers (## Header or **Header:**)
      const headerMatch = line.match(/^\*\*(.*):\*\*$/);
      if (headerMatch) {
        return (
          <h3 
            key={`header-${lineIndex}`}
            className="text-base sm:text-lg font-semibold mt-4 mb-2 border-b border-gray-800 pb-1"
          >
            {headerMatch[1]}
          </h3>
        );
      }

      // Check for bold text sections
      const boldSectionMatch = line.match(/^\*\*(.*)\*\*$/);
      if (boldSectionMatch && !line.includes('`')) {
        return (
          <h4 
            key={`bold-${lineIndex}`}
            className="font-semibold mt-3 mb-1"
          >
            {boldSectionMatch[1]}
          </h4>
        );
      }

      // Regular paragraph
      return (
        <p key={`para-${lineIndex}`} className="mb-2 leading-relaxed break-words">
          {formatInlineText(line, `${lineIndex}-para`)}
        </p>
      );
    });
  };

  // Format inline text with markdown styling
  const formatInlineText = (text, baseKey) => {
    const elements = [];
    let currentPosition = 0;
    let keySuffix = 0;

    // Process bold (**bold**), italic (*italic*), and inline code (`code`)
    const regex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|(`([^`]+)`)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentPosition) {
        const plainText = text.slice(currentPosition, match.index);
        elements.push(
          <span key={`${baseKey}-plain-${keySuffix++}`}>{plainText}</span>
        );
      }

      // Process the match
      if (match[1]) { // **bold**
        elements.push(
          <strong key={`${baseKey}-bold-${keySuffix++}`} className="font-semibold">
            {match[2]}
          </strong>
        );
      } else if (match[3]) { // *italic*
        elements.push(
          <em key={`${baseKey}-italic-${keySuffix++}`} className="italic">
            {match[4]}
          </em>
        );
      } else if (match[5]) { // `code`
        elements.push(
          <code 
            key={`${baseKey}-code-${keySuffix++}`}
            className="px-1 py-0.5 rounded text-sm font-mono text-green-600 break-all"
          >
            {match[6]}
          </code>
        );
      }

      currentPosition = match.index + match[0].length;
    }

    // Add remaining text
    if (currentPosition < text.length) {
      const remainingText = text.slice(currentPosition);
      elements.push(
        <span key={`${baseKey}-remain-${keySuffix++}`}>{remainingText}</span>
      );
    }

    return elements;
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex gap-2 sm:gap-3 mb-4 sm:mb-6 w-full ${
      isUser ? 'justify-end' : 'justify-start'
    }`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={16} className="sm:w-5 sm:h-5 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className={`text-left text-sm min-w-0 ${
        isUser 
          ? 'max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] order-first' 
          : 'max-w-[90%] sm:max-w-[85%] lg:max-w-[75%]'
      }`}>
        <div
          className={`rounded-lg px-3 sm:px-4 lg:px-5 py-3 sm:py-4 ${
            isUser
              ? 'bg-green-100 border text-black border-green-200 ml-auto'
              : 'border border-gray-800 w-full'
          }`}
        >
          {/* Message Parts */}
          <div className="space-y-1 overflow-hidden">
            {parseMessage.map((part, index) => (
              <div key={index} className="min-w-0">
                {part.type === 'text' ? (
                  <div className="prose prose-sm max-w-none min-w-0">
                    {isUser ? (
                      <div className="whitespace-pre-wrap leading-relaxed break-words">
                        {part.content}
                      </div>
                    ) : (
                      <div className="space-y-1 min-w-0">
                        {formatText(part.content)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 min-w-0 overflow-hidden">
                    <CodeBlock 
                      code={part.content} 
                      language={part.language} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer with timestamp and copy button */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100/20">
            <span className={`text-xs ${isUser ? 'text-green-600' : 'text-gray-400'}`}>
              {formatTimestamp(timestamp)}
            </span>
            
            <button
              onClick={copyMessage}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                isUser
                  ? 'text-green-600 hover:bg-green-200'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
              aria-label="Copy message"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-500 p-1 flex items-center justify-center flex-shrink-0 mt-1">
          <Image 
            src='/avat.png' 
            width={32} 
            height={32} 
            alt='avatar'
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
}