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
    [key: string]: any;
  };
  height: string;
  title?: string;
}

interface ComponentSelectorProps {
  onComponentSelect?: (componentName: string) => void;
  title?: string;
}

interface CardWithId extends CardData {
  uniqueId: string;
}

export default function SearchableCardSelector({ onComponentSelect, title = "Component Library" }: ComponentSelectorProps) {
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

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const searchLower = searchQuery.toLowerCase();
      const titleLower = (card.componentProps.title || card.title || card.importPath).toLowerCase();
      const importPathLower = card.importPath.toLowerCase();
      
      return titleLower.includes(searchLower) || importPathLower.includes(searchLower);
    });
  }, [cards, searchQuery]);

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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
        <div className="p-2 space-y-1">
          {filteredCards.map((card) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
