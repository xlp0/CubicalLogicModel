'use client';

import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Split View', path: '/SplitView' },
  { name: '3D Page', path: '/3DPage' },
  { name: 'Card Catalog', path: '/MCardCatalog' },
  { name: 'Paginated Cards', path: '/PaginatedCards' },
  { name: 'Pages On Cube', path: '/PagesOnCube' },
];

const FloatingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <div className="relative">
        {isOpen && (
          <div className="absolute left-0 bottom-full mb-2 w-56 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-gray-700/50">
            <div className="py-2">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700/90 hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/95 hover:bg-gray-700/95 text-gray-200 hover:text-white rounded-lg shadow-lg transition-all backdrop-blur-sm border border-gray-700/50"
        >
          <Menu size={18} />
          <span className="text-sm font-medium">Navigation</span>
          <ChevronDown
            size={18}
            className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </div>
  );
};

export default FloatingNav;
