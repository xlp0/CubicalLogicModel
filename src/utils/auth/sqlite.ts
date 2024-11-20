import Database from 'better-sqlite3';
import path from 'path';
import type { User, AuthDebugEvent } from '../../types/auth';
import crypto from 'crypto';
import fs from 'fs';
import { config } from '../config';

// Determine the database path and ensure data directory exists
const DB_PATH = path.resolve(process.cwd(), 'data', 'session.db');
const DB_DIR = path.dirname(DB_PATH);

// Create data directory if it doesn't exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create a singleton database connection
class AuthDatabase {
  private static instance: AuthDatabase;
  private db: Database.Database;

  private constructor() {
    try {
      // Open the database
      this.db = new Database(DB_PATH);
      
      // Create tables if they don't exist
      this.createTables();
    } catch (error) {
      console.error('[AuthDatabase] Failed to initialize database:', error);
      throw error;
    }
  }

  public static getInstance(): AuthDatabase {
    if (!AuthDatabase.instance) {
      AuthDatabase.instance = new AuthDatabase();
    }
    return AuthDatabase.instance;
  }

  private createTables(): void {
    try {
      // Drop existing tables if they exist
      this.db.prepare('DROP TABLE IF EXISTS auth_debug_events').run();
      this.db.prepare('DROP TABLE IF EXISTS auth_states').run();
      this.db.prepare('DROP TABLE IF EXISTS auth_sessions').run();

      // Create sessions table
      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS auth_sessions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          email TEXT,
          name TEXT,
          groups TEXT,
          accessToken TEXT NOT NULL,
          refreshToken TEXT,
          expiresAt DATETIME NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          lastActivity DATETIME,
          metadata TEXT
        )
      `).run();

      // Create auth states table
      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS auth_states (
          state TEXT PRIMARY KEY,
          flowId TEXT NOT NULL,
          codeVerifier TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          expiresAt DATETIME NOT NULL,
          metadata TEXT
        )
      `).run();

      // Create debug events table
      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS auth_debug_events (
          id TEXT PRIMARY KEY,
          eventType TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          details TEXT,
          metadata TEXT,
          flowId TEXT,
          sessionId TEXT,
          FOREIGN KEY(sessionId) REFERENCES auth_sessions(id)
        )
      `).run();

      // Create indexes
      this.db.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_userId ON auth_sessions(userId)').run();
      this.db.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_expiresAt ON auth_sessions(expiresAt)').run();
      this.db.prepare('CREATE INDEX IF NOT EXISTS idx_states_flowId ON auth_states(flowId)').run();
      this.db.prepare('CREATE INDEX IF NOT EXISTS idx_states_expiresAt ON auth_states(expiresAt)').run();
      this.db.prepare('CREATE INDEX IF NOT EXISTS idx_events_flowId ON auth_debug_events(flowId)').run();
      this.db.prepare('CREATE INDEX IF NOT EXISTS idx_events_timestamp ON auth_debug_events(timestamp)').run();
      this.db.prepare('CREATE INDEX IF NOT EXISTS idx_events_sessionId ON auth_debug_events(sessionId)').run();
    } catch (error) {
      console.error('[AuthDatabase] Failed to create tables:', error);
      throw error;
    }
  }

  public async createSession(accessToken: string, userId: string, refreshToken?: string): Promise<string> {
    try {
      const id = crypto.randomUUID();
      
      // Get user info from Authentik
      const userInfo = await this.getUserInfo(accessToken);
      
      const stmt = this.db.prepare(`
        INSERT INTO auth_sessions 
        (id, userId, email, name, groups, accessToken, refreshToken, expiresAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '+1 hour'))
      `);

      stmt.run(
        id,
        userId,
        userInfo.email,
        userInfo.name,
        JSON.stringify(userInfo.groups || []),
        accessToken,
        refreshToken
      );

      return id;
    } catch (error) {
      console.error('[AuthDatabase] Failed to create session:', error);
      throw error;
    }
  }

  private async getUserInfo(accessToken: string): Promise<User> {
    try {
      const response = await fetch(`${config.authentikBaseUrl}/application/o/userinfo/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      const data = await response.json();
      return {
        id: data.sub,
        email: data.email,
        name: data.name,
        groups: data.groups || []
      };
    } catch (error) {
      console.error('[AuthDatabase] Failed to get user info:', error);
      throw error;
    }
  }

  public getSessionsByToken(token: string): { id: string }[] {
    try {
      const stmt = this.db.prepare('SELECT id FROM auth_sessions WHERE accessToken = ? AND expiresAt > datetime()');
      return stmt.all(token);
    } catch (error) {
      console.error('[AuthDatabase] Failed to get sessions by token:', error);
      throw error;
    }
  }

  public getSession(id: string): {
    user: User;
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
  } | null {
    try {
      const stmt = this.db.prepare('SELECT * FROM auth_sessions WHERE id = ? AND expiresAt > datetime()');
      const session = stmt.get(id);

      if (!session) return null;

      return {
        user: {
          id: session.userId,
          email: session.email,
          name: session.name,
          groups: JSON.parse(session.groups || '[]')
        },
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: new Date(session.expiresAt)
      };
    } catch (error) {
      console.error('[AuthDatabase] Failed to get session:', error);
      throw error;
    }
  }

  public async refreshSession(id: string): Promise<boolean> {
    try {
      const session = this.getSession(id);
      if (!session?.refreshToken) return false;

      // Exchange refresh token for new access token
      const response = await fetch(`${config.authentikBaseUrl}/application/o/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: config.authentikClientId,
          refresh_token: session.refreshToken,
          ...(config.authentikClientSecret && {
            client_secret: config.authentikClientSecret
          })
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokens = await response.json();
      
      // Update session with new tokens
      const stmt = this.db.prepare(`
        UPDATE auth_sessions 
        SET accessToken = ?, refreshToken = ?, expiresAt = datetime('now', '+1 hour')
        WHERE id = ?
      `);

      stmt.run(tokens.access_token, tokens.refresh_token, id);
      return true;
    } catch (error) {
      console.error('[AuthDatabase] Failed to refresh token:', error);
      return false;
    }
  }

  public createAuthState(state: string, codeVerifier: string): void {
    try {
      const flowId = crypto.randomUUID();
      const stmt = this.db.prepare(`
        INSERT INTO auth_states 
        (state, flowId, codeVerifier, expiresAt)
        VALUES (?, ?, ?, datetime('now', '+5 minutes'))
      `);

      stmt.run(state, flowId, codeVerifier);
    } catch (error) {
      console.error('[AuthDatabase] Failed to create auth state:', error);
      throw error;
    }
  }

  public getAuthState(state: string): { flowId: string; codeVerifier: string } | null {
    try {
      const stmt = this.db.prepare(`
        SELECT flowId, codeVerifier 
        FROM auth_states 
        WHERE state = ? AND expiresAt > datetime()
      `);
      return stmt.get(state);
    } catch (error) {
      console.error('[AuthDatabase] Failed to get auth state:', error);
      throw error;
    }
  }

  public deleteSession(id: string): void {
    try {
      const stmt = this.db.prepare('DELETE FROM auth_sessions WHERE id = ?');
      stmt.run(id);
    } catch (error) {
      console.error('[AuthDatabase] Failed to delete session:', error);
      throw error;
    }
  }

  public createAuthDebugEvent(event: Omit<AuthDebugEvent, 'timestamp'>): void {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO auth_debug_events 
        (id, eventType, details, metadata, flowId, sessionId)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        crypto.randomUUID(),
        event.eventType,
        JSON.stringify(event.details || {}),
        JSON.stringify(event.metadata || {}),
        event.details?.flowId || null,
        event.metadata?.sessionId || null
      );
    } catch (error) {
      console.error('[AuthDatabase] Failed to create debug event:', error);
      throw error;
    }
  }

  public getSessionEvents(sessionId: string): AuthDebugEvent[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM auth_debug_events 
        WHERE sessionId = ? 
        ORDER BY timestamp DESC
      `);
      return stmt.all(sessionId).map(this.mapDebugEvent);
    } catch (error) {
      console.error('[AuthDatabase] Failed to get session events:', error);
      throw error;
    }
  }

  public getFlowEvents(flowId: string): AuthDebugEvent[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM auth_debug_events 
        WHERE flowId = ? 
        ORDER BY timestamp ASC
      `);
      return stmt.all(flowId).map(this.mapDebugEvent);
    } catch (error) {
      console.error('[AuthDatabase] Failed to get flow events:', error);
      throw error;
    }
  }

  private mapDebugEvent(row: any): AuthDebugEvent {
    return {
      timestamp: new Date(row.timestamp).getTime(),
      eventType: row.eventType,
      details: JSON.parse(row.details),
      metadata: JSON.parse(row.metadata)
    };
  }

  public exportDebugData(): {
    sessions: any[];
    states: any[];
    events: AuthDebugEvent[];
  } {
    try {
      return {
        sessions: this.db.prepare('SELECT * FROM auth_sessions').all(),
        states: this.db.prepare('SELECT * FROM auth_states').all(),
        events: this.db.prepare('SELECT * FROM auth_debug_events').all().map(this.mapDebugEvent)
      };
    } catch (error) {
      console.error('[AuthDatabase] Failed to export debug data:', error);
      throw error;
    }
  }

  public cleanup(): void {
    try {
      // Delete expired sessions
      this.db.prepare('DELETE FROM auth_sessions WHERE expiresAt <= datetime()').run();
      
      // Delete expired auth states
      this.db.prepare('DELETE FROM auth_states WHERE expiresAt <= datetime()').run();
      
      // Delete old debug events (keep last 7 days)
      this.db.prepare(`
        DELETE FROM auth_debug_events 
        WHERE timestamp <= datetime('now', '-7 days')
      `).run();
    } catch (error) {
      console.error('[AuthDatabase] Failed to cleanup:', error);
      throw error;
    }
  }

  public close(): void {
    try {
      this.db.close();
    } catch (error) {
      console.error('[AuthDatabase] Failed to close database:', error);
      throw error;
    }
  }

  public setupCleanupInterval(): void {
    try {
      // Run cleanup every 5 minutes
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    } catch (error) {
      console.error('[AuthDatabase] Failed to setup cleanup interval:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const authDb = AuthDatabase.getInstance();

// Run cleanup on startup
authDb.cleanup();

// Start periodic cleanup
authDb.setupCleanupInterval();

// Graceful shutdown
process.on('SIGINT', () => {
  authDb.close();
  process.exit();
});
