import { Session } from '@astrojs/node';
import type { AuthSession } from '../types/auth';

// Define authentication stages for comprehensive tracking
export enum AuthStage {
  INIT = 'INIT',
  CODE_GENERATED = 'CODE_GENERATED',
  STATE_CREATED = 'STATE_CREATED',
  VERIFIER_GENERATED = 'VERIFIER_GENERATED',
  TOKEN_REQUESTED = 'TOKEN_REQUESTED',
  TOKEN_RECEIVED = 'TOKEN_RECEIVED',
  USER_INFO_FETCHED = 'USER_INFO_FETCHED',
  AUTH_COMPLETE = 'AUTH_COMPLETE',
  ERROR = 'ERROR'
}

// Enhanced session tracking with detailed authentication stages
export interface EnhancedAuthSession extends AuthSession {
  authStages: {
    stage: AuthStage;
    timestamp: number;
    details?: Record<string, any>;
  }[];
  lastError?: {
    stage: AuthStage;
    message: string;
    timestamp: number;
  };
}

// In-memory session store for development
const sessions = new Map<string, EnhancedAuthSession>();

// Generate a secure random session ID
function generateSessionId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSession(session: Partial<EnhancedAuthSession> = {}): Promise<string> {
  const sessionId = generateSessionId();
  const defaultSession: EnhancedAuthSession = {
    ...session,
    authStages: [{
      stage: AuthStage.INIT,
      timestamp: Date.now()
    }],
  };
  sessions.set(sessionId, defaultSession);
  return sessionId;
}

export async function getSession(sessionId: string): Promise<EnhancedAuthSession | null> {
  return sessions.get(sessionId) || null;
}

export async function updateSessionStage(
  sessionId: string, 
  stage: AuthStage, 
  details?: Record<string, any>
): Promise<void> {
  const session = sessions.get(sessionId);
  if (session) {
    session.authStages.push({
      stage,
      timestamp: Date.now(),
      details
    });
    sessions.set(sessionId, session);
  }
}

export async function recordSessionError(
  sessionId: string, 
  stage: AuthStage, 
  errorMessage: string
): Promise<void> {
  const session = sessions.get(sessionId);
  if (session) {
    session.lastError = {
      stage,
      message: errorMessage,
      timestamp: Date.now()
    };
    session.authStages.push({
      stage: AuthStage.ERROR,
      timestamp: Date.now(),
      details: { errorMessage }
    });
    sessions.set(sessionId, session);
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  sessions.delete(sessionId);
}

export async function updateSession(
  sessionId: string, 
  session: Partial<EnhancedAuthSession>
): Promise<void> {
  const existingSession = sessions.get(sessionId);
  if (existingSession) {
    sessions.set(sessionId, { ...existingSession, ...session });
  }
}
