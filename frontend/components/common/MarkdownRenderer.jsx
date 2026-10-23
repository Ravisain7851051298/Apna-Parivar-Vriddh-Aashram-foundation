'use client';

import React from 'react';

/**
 * Universal Markdown Renderer for Events, Campaigns, News/Media, and Gallery descriptions.
 * Handles headings, bold, italic, strikethrough, blockquotes, unordered/ordered lists,
 * links, code spans/blocks, and line breaks without external dependencies.
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content || typeof content !== 'string') {
    return <span className="text-stone-400 italic">No description provided.</span>;
  }

  // Parse inline markdown tokens: bold, italic, code, links, strikethrough
  const renderInline = (text) => {
    if (!text) return null;

    // Pattern to split by bold, italic, strike, inline code, and links
    const tokenRegex = /(\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Bold **text** or __text__
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        return (
          <strong key={index} className="font-black text-stone-950">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Strikethrough ~~text~~
      if (part.startsWith('~~') && part.endsWith('~~')) {
        return (
          <del key={index} className="line-through text-stone-400">
            {part.slice(2, -2)}
          </del>
        );
      }

      // Inline code `code`
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded-md bg-amber-100/80 text-amber-950 font-mono text-[11px] border border-amber-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Link [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, linkText, linkUrl] = linkMatch;
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-800 hover:text-amber-950 underline font-bold decoration-amber-400 hover:decoration-amber-700 transition"
          >
            {linkText}
          </a>
        );
      }

      // Italic *text* or _text_
      if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
        return (
          <em key={index} className="italic text-stone-800">
            {part.slice(1, -1)}
          </em>
        );
      }

      return part;
    });
  };

  // Split into lines for block-level parsing
  const rawLines = content.replace(/\r\n/g, '\n').split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1 list-disc list-inside text-stone-700 pl-2">
          {currentList.items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(it)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`list-${elements.length}`} className="my-2 space-y-1 list-decimal list-inside text-stone-700 pl-2">
          {currentList.items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(it)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Code block fences ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="my-3 p-3.5 rounded-2xl bg-stone-900 text-amber-200 overflow-x-auto text-xs font-mono border border-stone-800 shadow-sm"
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Horizontal rule --- or ***
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="my-3 border-amber-200/80" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${elements.length}`} className="text-lg sm:text-xl font-black text-stone-950 mt-3 mb-1">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-base sm:text-lg font-black text-stone-950 mt-2.5 mb-1">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-sm sm:text-base font-bold text-stone-900 mt-2 mb-0.5">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${elements.length}`} className="text-xs sm:text-sm font-bold text-stone-900 mt-1.5 mb-0.5">
          {renderInline(trimmed.slice(5))}
        </h4>
      );
      continue;
    }

    // Blockquotes > quote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="my-2 pl-3 py-1.5 border-l-3 border-amber-500 bg-amber-50/60 rounded-r-xl text-stone-700 italic text-xs leading-relaxed"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered lists (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Ordered lists (1. or 2.)
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const itemText = olMatch[2];
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // If empty line, flush list and insert spacing
    if (!trimmed) {
      flushList();
      continue;
    }

    // Standard paragraph line
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="my-1.5 leading-relaxed text-stone-700">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return (
    <div className={`prose-stone max-w-none text-xs sm:text-sm leading-relaxed ${className}`}>
      {elements}
    </div>
  );
}
