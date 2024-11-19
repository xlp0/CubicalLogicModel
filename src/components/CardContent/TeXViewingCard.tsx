'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TeXViewingCardProps {
  title?: string;
  contentString?: string;
  fileName?: string;
  style?: React.CSSProperties;
}

const defaultTeXContent = `# TeX Viewer

## Inline Math Example
When $a \\ne 0$, there are two solutions to $ax^2 + bx + c = 0$ and they are:

## Display Math Example
$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$

## Matrix Examples
1. Simple Matrix:
$$
\\begin{matrix}
a & b \\\\
c & d
\\end{matrix}
$$

2. Matrix with parentheses:
$$
\\begin{pmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{pmatrix}
$$

3. Matrix with brackets:
$$
\\begin{bmatrix}
x_{11} & x_{12} \\\\
x_{21} & x_{22}
\\end{bmatrix}
$$

4. Augmented Matrix:
$$
\\left[
\\begin{array}{cc|c}
1 & 2 & 3 \\\\
4 & 5 & 6
\\end{array}
\\right]
$$
`;

export default function TeXViewingCard(props: TeXViewingCardProps) {
  // Extract all props with defaults
  const { 
    title = "TeX Viewer",
    contentString,
    fileName,
    style = {}
  } = props;

  const [content, setContent] = useState(contentString ?? defaultTeXContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        })
        .catch(error => {
          console.error('Error loading markdown file:', error);
          setContent(`Error loading ${fileName}: ${error.message}`);
          setIsLoading(false);
        });
    }
  }, [fileName]);

  const katexOptions = {
    strict: false,
    trust: true,
    throwOnError: false,
    macros: {
      "\\eqref": "\\href{###1}{(\\text{#1})}",
      "\\label": "\\htmlId{#1}{}",
      "\\ref": "\\href{###1}{\\text{#1}}"
    },
    fleqn: false,
    leqno: false,
    output: "html",
    maxSize: 500,
    maxExpand: 1000,
    displayMode: true
  };

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
        ) : isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-800 dark:text-gray-100 resize-none"
            placeholder="Enter your TeX markdown here..."
          />
        ) : (
          <div className="p-6 prose dark:prose-invert prose-sm sm:prose-base max-w-none overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[[rehypeKatex, katexOptions]]}
              components={{
                pre: ({ node, ...props }) => (
                  <div className="overflow-auto">
                    <pre {...props} />
                  </div>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
