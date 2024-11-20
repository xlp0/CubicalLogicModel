'use client';

import { useState, Suspense, type CSSProperties } from 'react';
import MCard from '../MCard';

interface CardConfig {
  importPath: string;
  componentProps?: Record<string, any>;
  width?: string;
  height?: string;
}

interface PaginatedCardListProps {
  title?: string;
  cards: CardConfig[];
  columns?: number;
  gap?: number;
  itemsPerPage?: number;
  className?: string;
  style?: CSSProperties;
}

const PaginatedCardList = ({
  title,
  cards,
  columns = 4,
  gap = 6,
  itemsPerPage = 12,
  className = '',
  style = {}
}: PaginatedCardListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCards = cards.slice(startIndex, endIndex);

  return (
    <div className={`flex flex-col min-h-0 ${className}`} style={style}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
        </div>
      )}
      
      <div className="flex-1 min-h-0">
        <div 
          className="grid h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap * 0.25}rem`,
          }}
        >
          {currentCards.map((card, index) => (
            <div 
              key={`${card.importPath}-${index}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
              style={{ height: card.height || '400px' }}
            >
              <Suspense fallback={
                <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                  <div className="text-gray-400">Loading...</div>
                </div>
              }>
                <MCard
                  importPath={card.importPath}
                  componentProps={{
                    ...card.componentProps,
                    style: {
                      height: '100%',
                      width: '100%',
                      ...card.componentProps?.style
                    }
                  }}
                />
              </Suspense>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-300 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedCardList;
