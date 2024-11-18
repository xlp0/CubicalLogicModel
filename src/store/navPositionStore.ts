import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavPosition {
  x: number;
  y: number;
}

interface NavPositionStore {
  position: NavPosition;
  setPosition: (position: NavPosition) => void;
}

// Default position (will be overridden by component on mount)
const defaultPosition = {
  x: 0,
  y: 0
};

export const useNavPositionStore = create<NavPositionStore>()(
  persist(
    (set) => ({
      position: defaultPosition,
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'nav-position-storage',
      skipHydration: true // Skip hydration to prevent SSR mismatch
    }
  )
);
