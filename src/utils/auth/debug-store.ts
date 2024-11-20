import type { AuthDebugEvent } from '../../types/auth';

interface AuthDebugStore {
  dbName: 'auth_debug_store';
  version: 1;
  stores: {
    events: {
      keyPath: 'timestamp';
      indexes: {
        eventType: string;
        flowId: string;
        timestamp: number;
      };
    };
    flows: {
      keyPath: 'flowId';
      indexes: {
        startTime: number;
        endTime: number;
      };
    };
  };
}

class AuthDebugManager {
  private static instance: AuthDebugManager;
  private db: IDBDatabase | null = null;

  private constructor() {
    this.initializeDB();
  }

  public static getInstance(): AuthDebugManager {
    if (!AuthDebugManager.instance) {
      AuthDebugManager.instance = new AuthDebugManager();
    }
    return AuthDebugManager.instance;
  }

  private initializeDB(): void {
    const request = indexedDB.open('auth_debug_store', 1);

    request.onerror = () => {
      console.error('[Auth] Failed to open IndexedDB:', request.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create events store
      const eventsStore = db.createObjectStore('events', { keyPath: 'timestamp' });
      eventsStore.createIndex('eventType', 'eventType', { unique: false });
      eventsStore.createIndex('flowId', 'flowId', { unique: false });
      eventsStore.createIndex('timestamp', 'timestamp', { unique: true });

      // Create flows store
      const flowsStore = db.createObjectStore('flows', { keyPath: 'flowId' });
      flowsStore.createIndex('startTime', 'startTime', { unique: false });
      flowsStore.createIndex('endTime', 'endTime', { unique: false });
    };

    request.onsuccess = () => {
      this.db = request.result;
    };
  }

  public async logEvent(event: AuthDebugEvent): Promise<void> {
    if (!this.db) {
      console.error('[Auth] IndexedDB not initialized');
      return;
    }

    const transaction = this.db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');

    return new Promise((resolve, reject) => {
      const request = store.add(event);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async getEventTimeline(flowId: string): Promise<AuthDebugEvent[]> {
    if (!this.db) {
      console.error('[Auth] IndexedDB not initialized');
      return [];
    }

    const transaction = this.db.transaction('events', 'readonly');
    const store = transaction.objectStore('events');
    const index = store.index('flowId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(flowId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const events = request.result as AuthDebugEvent[];
        resolve(events.sort((a, b) => a.timestamp - b.timestamp));
      };
    });
  }

  public async clearEvents(): Promise<void> {
    if (!this.db) {
      console.error('[Auth] IndexedDB not initialized');
      return;
    }

    const transaction = this.db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async exportEvents(flowId?: string): Promise<AuthDebugEvent[]> {
    if (!this.db) {
      console.error('[Auth] IndexedDB not initialized');
      return [];
    }

    const transaction = this.db.transaction('events', 'readonly');
    const store = transaction.objectStore('events');

    return new Promise((resolve, reject) => {
      let request: IDBRequest;
      if (flowId) {
        const index = store.index('flowId');
        request = index.getAll(flowId);
      } else {
        request = store.getAll();
      }

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as AuthDebugEvent[]);
    });
  }
}

// Export singleton instance
export const authDebugManager = AuthDebugManager.getInstance();
