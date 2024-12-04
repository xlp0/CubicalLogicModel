'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMermaid from 'remark-mermaidjs';
import 'katex/dist/katex.min.css';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MarkdownViewingCardProps {
  title?: string;
  contentString?: string;
  fileName?: string;
  style?: CSSProperties;
}

const defaultContent = `# Sample Markdown with Math and Diagrams

## Math Example
When $a \\ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are:
$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$

## Mermaid Diagram Example
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`
`;

export default function MarkdownViewingCard(props: MarkdownViewingCardProps) {
  const { 
    title = "Markdown Viewer",
    contentString,
    fileName,
    style = {}
  } = props;

  const [content, setContent] = useState(contentString ?? defaultContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update content when contentString prop changes
  useEffect(() => {
    if (contentString !== undefined) {
      setContent(contentString);
    }
  }, [contentString]);

  // Load content from file when fileName prop changes
  useEffect(() => {
    if (fileName) {
      setIsLoading(true);
      fetch(`/md/${fileName}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          setContent(text);
          setIsLoading(false);
          setError(null);
        })
        .catch(error => {
          console.error('Error loading file:', error);
          setError(`Error loading ${fileName}: ${error.message}`);
          setIsLoading(false);
        });
    }
  }, [fileName]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900" style={style}>
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full h-full p-4",
              "font-mono text-sm",
              "text-white bg-[#1E1E1E]",
              "resize-none",
              "focus:outline-none focus:ring-0",
              "selection:bg-blue-500/30"
            )}
            placeholder="Enter your markdown content here..."
            spellCheck={false}
          />
        ) : (
          <div className="p-6 prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm, remarkMermaid]}
              rehypePlugins={[rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
