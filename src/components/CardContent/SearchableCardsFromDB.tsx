'use client';

import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { 
  FaReact, 
  FaYoutube, 
  FaCalculator, 
  FaClock, 
  FaMusic, 
  FaCube, 
  FaList, 
  FaImage, 
  FaCode, 
  FaChartBar,
  FaPalette,
  FaFileAlt,
  FaFolder,
  FaSearch
} from 'react-icons/fa';
import type { ChangeEvent } from 'react';

interface CardData {
  id: number;
  importPath: string;
  title: string | null;
  height: string;
  componentProps: any;
}

interface ComponentSelectorProps {
  onComponentSelect?: (componentName: string) => void;
  title?: string;
}

interface CardWithId extends CardData {
  uniqueId: string;
}

export default function SearchableCardsFromDB({ onComponentSelect, title = "Component Library" }: ComponentSelectorProps) {
  const [cards, setCards] = useState<CardWithId[]>([]);
  const [activeCardId, setActiveCardId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchCards = async (query?: string) => {
    try {
      setIsLoading(true);
      
      console.group('[Client] Fetch Cards Debug');
      console.log('Raw input query:', query);
      console.log('Current search query state:', searchQuery);
      
      const effectiveQuery = query || searchQuery;
      const trimmedQuery = effectiveQuery?.trim() || '';
      
      // Create search params with cache busting
      const searchParams = new URLSearchParams();
      if (trimmedQuery) {
        searchParams.set('q', trimmedQuery);
      }
      // Add timestamp to prevent caching
      searchParams.set('_t', Date.now().toString());
      
      // Construct URL with search params
      const requestUrl = `/api/cards${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      console.log('Search params object:', Object.fromEntries(searchParams));
      console.log('Search params string:', searchParams.toString());
      console.log('Final request URL:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Log response details
      console.log('[Client] Response status:', response.status);
      console.log('[Client] Response headers:', Object.fromEntries(response.headers));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Client] Error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[Client] Response data:', data);
      
      if (!data.success) {
        throw new Error(`API error: ${data.error || 'Unknown error'}`);
      }
      
      if (!data.cards || !Array.isArray(data.cards)) {
        throw new Error('Invalid response format: cards array missing');
      }
      
      const cardsWithIds = data.cards.map((card: CardData) => ({
        ...card,
        uniqueId: `${card.importPath}-${card.id}`
      }));
      
      setCards(cardsWithIds);
    } catch (error) {
      console.error('[Client] Error loading cards:', error);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    console.group('[Client] Search Change Debug');
    console.log('Input value:', value);
    console.log('Previous search query:', searchQuery);
    
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      console.log('Debounced search triggered with:', value);
      console.log('Will fetch cards with:', value);
      console.groupEnd();
      
      if (value.trim()) {
        fetchCards(value);
      } else {
        fetchCards();
      }
    }, 300);
  };

  useEffect(() => {
    fetchCards();
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (card: CardWithId) => {
    setActiveCardId(card.uniqueId);
    
    const event = new CustomEvent('component-selected', { 
      detail: {
        importPath: card.importPath,
        componentProps: card.componentProps
      },
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(event);
    
    if (onComponentSelect) {
      onComponentSelect(card.importPath);
    }
  };

  const getComponentIcon = (importPath: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'ThreeJsCube': <FaCube className="w-5 h-5 text-blue-400 flex-shrink-0" />,
      'YouTubePlayer': <FaYoutube className="w-5 h-5 text-red-500 flex-shrink-0" />,
      'Calculator': <FaCalculator className="w-5 h-5 text-yellow-400 flex-shrink-0" />,
      'Notes': <FaFileAlt className="w-5 h-5 text-green-400 flex-shrink-0" />,
      'Clock': <FaClock className="w-5 h-5 text-blue-400 flex-shrink-0" />,
      'TodoList': <FaList className="w-5 h-5 text-orange-500 flex-shrink-0" />,
      'SpotifyPlayer': <FaMusic className="w-5 h-5 text-green-500 flex-shrink-0" />,
      'LogoDisplay': <FaImage className="w-5 h-5 text-blue-500 flex-shrink-0" />,
      'Dashboard': <FaChartBar className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
      'ColorPicker': <FaPalette className="w-5 h-5 text-purple-400 flex-shrink-0" />,
      'AbstractSpec': <FaCode className="w-5 h-5 text-purple-500 flex-shrink-0" />,
      'ConcreteImpl': <FaCode className="w-5 h-5 text-indigo-500 flex-shrink-0" />,
      'TreeView': <FaFolder className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
      'WebPageCube': <FaCube className="w-5 h-5 text-pink-500 flex-shrink-0" />,
      'Counter': <FaReact className="w-5 h-5 text-cyan-400 animate-spin-slow flex-shrink-0" />
    };

    return iconMap[importPath] || <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />;
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-gray-100 text-sm font-semibold mb-3">{title}</h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <FaSearch className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 w-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            cards.map((card) => (
              <Button
                key={card.uniqueId}
                variant={activeCardId === card.uniqueId ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 py-1.5 text-gray-100 transition-colors duration-200 ${
                  activeCardId === card.uniqueId 
                    ? 'bg-gray-700/90 hover:bg-gray-700' 
                    : 'hover:bg-gray-800/90'
                }`}
                onClick={() => handleSelect(card)}
              >
                <div className="flex-shrink-0 w-5">
                  {getComponentIcon(card.importPath)}
                </div>
                <span className="text-sm truncate flex-1">
                  {card.componentProps.title || card.title || card.importPath}
                </span>
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
