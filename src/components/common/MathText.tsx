import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

interface Segment {
  type: 'text' | 'inline-math' | 'block-math';
  content: string;
}

export const parseMathSegments = (input: string): Segment[] => {
  if (!input) return [];
  if (!input.includes('$')) {
    return [{ type: 'text', content: input }];
  }

  const segments: Segment[] = [];
  // Regex matches $$...$$ (block) or $...$ (inline, non-empty, not spanning unescaped line breaks inappropriately)
  const mathRegex = /(\$\$[\s\S]+?\$\$|\$(?:\\.|[^\$\n\\])+\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: input.slice(lastIndex, match.index),
      });
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$') && matchedStr.length >= 4) {
      segments.push({
        type: 'block-math',
        content: matchedStr.slice(2, -2).trim(),
      });
    } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$') && matchedStr.length >= 2) {
      segments.push({
        type: 'inline-math',
        content: matchedStr.slice(1, -1).trim(),
      });
    } else {
      segments.push({
        type: 'text',
        content: matchedStr,
      });
    }

    lastIndex = match.index + matchedStr.length;
  }

  if (lastIndex < input.length) {
    segments.push({
      type: 'text',
      content: input.slice(lastIndex),
    });
  }

  return segments;
};

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const segments = useMemo(() => parseMathSegments(text), [text]);

  if (!text.includes('$')) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`math-text-container ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
        }

        const isBlock = seg.type === 'block-math';
        try {
          const html = katex.renderToString(seg.content, {
            displayMode: isBlock,
            throwOnError: false,
          });

          if (isBlock) {
            return (
              <span
                key={idx}
                className="block my-2 text-center overflow-x-auto py-1"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          return (
            <span
              key={idx}
              className="inline-math mx-0.5 inline-block align-baseline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={idx} className="font-mono text-amber-700">${seg.content}$</span>;
        }
      })}
    </span>
  );
};
