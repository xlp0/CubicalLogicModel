import { AuthStage } from '../stores/sessionStore';

export interface User {
  id: string;
  email: string;
  name?: string;
  groups?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error?: string;
}

export interface AuthError extends Error {
  code: string;
  details?: string;
}

export interface AuthDebugEvent {
  timestamp: number;
  eventType: 'auth_start' | 'auth_redirect' | 'token_received' | 'auth_error' | 'auth_complete';
  details: {
    state?: string;
    error?: string;
    flowId?: string;
    [key: string]: any;
  };
  metadata: {
    userAgent: string;
    timestamp: string;
    sessionId?: string;
  };
}
