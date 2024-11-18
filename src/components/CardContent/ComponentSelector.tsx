import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function ComponentSelector({ onComponentSelect, title = "Selected Cards" }: ComponentSelectorProps) {
  const [cards, setCards] = useState<CardWithId[]>([]);
  const [activeCardId, setActiveCardId] = useState<string>();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/src/data/SelectedCards.json');
        const data = await response.json();
        // Add unique IDs to each card
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
    
    // Create a custom event with both the component name and its props
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

  return (
    <div className="h-full flex flex-col bg-gray-800/80">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white text-sm font-semibold">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="p-2 space-y-1">
          {cards.map((card) => (
            <Button
              key={card.uniqueId}
              variant={activeCardId === card.uniqueId ? "secondary" : "ghost"}
              className={`w-full justify-start gap-2 py-1 ${
                activeCardId === card.uniqueId ? 'bg-gray-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => handleSelect(card)}
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm truncate">
                {card.componentProps.title || card.title || card.importPath}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
