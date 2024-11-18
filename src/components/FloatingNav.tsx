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
  { name: 'Cubical Model', path: '/cubical-model' },
];

const FloatingNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg shadow-lg transition-colors"
        >
          <Menu size={16} />
          <span>Navigation</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="py-1">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingNav;
