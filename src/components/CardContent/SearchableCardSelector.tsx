'use client';

import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { FileText } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
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

interface CardData {
  importPath: string;
  componentProps: {
    title: string;
    videoId?: string;
    iconPath?: string;
    [key: string]: any;
  };
  height: string;
  title?: string;
}

interface SearchableCardSelectorProps {
  onComponentSelect?: (componentName: string) => void;
  title?: string;
}

interface CardWithId extends CardData {
  uniqueId: string;
}

export default function SearchableCardSelector({ onComponentSelect, title = "Component Library" }: SearchableCardSelectorProps) {
  const [cards, setCards] = useState<CardWithId[]>([]);
  const [activeCardId, setActiveCardId] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/src/data/SelectedCards.json');
        const data = await response.json();
        const cardsWithIds = data.cards.map((card: CardData, index: number) => ({
          ...card,
          uniqueId: `${card.importPath}-${index}`
        }));
        setCards(cardsWithIds);
      } catch (error) {
        console.error('Error loading cards:', error);
      }
    };

    fetchCards();
  }, []);

  const handleSelect = (card: CardWithId) => {
    setActiveCardId(card.uniqueId);
    
    const event = new CustomEvent('componentSelected', { 
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
      'ThreeJsCube': <FaCube className="w-4 h-4 text-blue-400" />,
      'YouTubePlayer': <FaYoutube className="w-4 h-4 text-red-500" />,
      'Calculator': <FaCalculator className="w-4 h-4 text-yellow-400" />,
      'Notes': <FaFileAlt className="w-4 h-4 text-green-400" />,
      'Clock': <FaClock className="w-4 h-4 text-blue-400" />,
      'TodoList': <FaList className="w-4 h-4 text-orange-500" />,
      'SpotifyPlayer': <FaMusic className="w-4 h-4 text-green-500" />,
      'LogoDisplay': <FaImage className="w-4 h-4 text-blue-500" />,
      'Dashboard': <FaChartBar className="w-4 h-4 text-cyan-400" />,
      'ColorPicker': <FaPalette className="w-4 h-4 text-purple-400" />,
      'AbstractSpec': <FaCode className="w-4 h-4 text-purple-500" />,
      'ConcreteImpl': <FaCode className="w-4 h-4 text-indigo-500" />,
      'TreeView': <FaFolder className="w-4 h-4 text-yellow-500" />,
      'WebPageCube': <FaCube className="w-4 h-4 text-pink-500" />,
      'Counter': <FaReact className="w-4 h-4 text-cyan-400 animate-spin-slow" />
    };

    return iconMap[importPath] || <FileText className="w-4 h-4 text-gray-400" />;
  };

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;

    const query = searchQuery.toLowerCase();
    return cards.filter(card => {
      const title = (card.componentProps.title || card.title || card.importPath).toLowerCase();
      const importPath = card.importPath.toLowerCase();
      return title.includes(query) || importPath.includes(query);
    });
  }, [cards, searchQuery]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-700/50 space-y-4">
        <h3 className="text-gray-100 text-sm font-semibold">{title}</h3>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
        <div className="p-2 space-y-1">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <Button
                key={card.uniqueId}
                variant={activeCardId === card.uniqueId ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 py-1.5 text-gray-100 transition-colors duration-200 ${
                  activeCardId === card.uniqueId 
                    ? 'bg-gray-700/90 hover:bg-gray-700' 
                    : 'hover:bg-gray-800/90'
                }`}
                onClick={() => handleSelect(card)}
              >
                {getComponentIcon(card.importPath)}
                <span className="text-sm truncate">
                  {card.componentProps.title || card.title || card.importPath}
                </span>
              </Button>
            ))
          ) : (
            <div className="text-gray-400 text-sm text-center py-4">
              No components found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
