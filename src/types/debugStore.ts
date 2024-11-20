// Type definitions for debug store
export interface DebugStore {
  ready: boolean;
  lastError: Error | null;
  logEvent: (event: string, data?: any) => Promise<void>;
  getEvents: () => Promise<any[]>;
}

declare global {
  interface Window {
    debugStore: DebugStore;
  }
}
