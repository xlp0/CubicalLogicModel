import { atom } from 'nanostores';
import Cookies from 'js-cookie'; // We'll keep this for potential future use

export interface User {
  name: string;
  email: string;
  id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
};

export const $authStore = atom<AuthState>(initialState);

class TokenManager {
  private static _instance: TokenManager;
  private _token: string | null = null;
  private _user: User | null = null;
  private _tokenExpiry: number | null = null;

  private constructor() {
    // Attempt to restore state from localStorage
    this.restoreStateFromStorage();
  }

  public static getInstance(): TokenManager {
    if (!TokenManager._instance) {
      TokenManager._instance = new TokenManager();
    }
    return TokenManager._instance;
  }

  // Persist state to localStorage
  private persistStateToStorage() {
    try {
      if (this._token && this._user) {
        localStorage.setItem('auth_token', this._token);
        localStorage.setItem('auth_user', JSON.stringify(this._user));
        localStorage.setItem('auth_token_expiry', this._tokenExpiry?.toString() || '');
        
        console.log(' [TokenManager] State persisted to localStorage');
      }
    } catch (error) {
      console.error('[TokenManager] Failed to persist state:', error);
    }
  }

  // Restore state from localStorage
  private restoreStateFromStorage() {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      const storedExpiry = localStorage.getItem('auth_token_expiry');

      if (storedToken && storedUser) {
        this._token = storedToken;
        this._user = JSON.parse(storedUser);
        this._tokenExpiry = storedExpiry ? parseInt(storedExpiry, 10) : null;

        // Update store state
        $authStore.set({
          user: this._user,
          token: this._token,
          isAuthenticated: this.validateToken()
        });

        console.log('[TokenManager] State restored from localStorage', {
          hasToken: !!this._token,
          hasUser: !!this._user
        });
      }
    } catch (error) {
      console.error('[TokenManager] Failed to restore state:', error);
      this.clear();
    }
  }

  setToken(token: string, user: User, expiresIn?: number) {
    console.group('[TokenManager] Setting Auth State');
    console.log(' Token received', { 
      tokenLength: token.length, 
      userName: user.name 
    });

    // Validate inputs
    if (!token || !user.email || !user.id) {
      console.error('Invalid token or user data');
      this.clear();
      return false;
    }

    // Set in-memory storage
    this._token = token;
    this._user = user;
    
    // Set token expiry if provided
    this._tokenExpiry = expiresIn 
      ? Date.now() + (expiresIn * 1000)  // convert to milliseconds
      : null;

    // Update store
    $authStore.set({
      user,
      token,
      isAuthenticated: true
    });

    // Persist to localStorage
    this.persistStateToStorage();

    console.log(' Auth state set successfully');
    console.groupEnd();
    return true;
  }

  getToken(): string | null {
    return this._token;
  }

  getUser(): User | null {
    return this._user;
  }

  clear() {
    console.group('[TokenManager] Clearing Auth State');
    
    // Clear in-memory storage
    this._token = null;
    this._user = null;
    this._tokenExpiry = null;

    // Clear localStorage
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token_expiry');
    } catch (error) {
      console.error('[TokenManager] Failed to clear localStorage:', error);
    }

    // Reset store
    $authStore.set(initialState);

    console.log(' Auth state cleared');
    console.groupEnd();
  }

  validateToken(): boolean {
    // Check if token exists
    if (!this._token) {
      console.log('No token found');
      return false;
    }

    // Check token expiry if set
    if (this._tokenExpiry && Date.now() > this._tokenExpiry) {
      console.log('Token expired');
      this.clear();
      return false;
    }

    // Additional validation can be added here
    // For example, you might want to make a quick API call to validate the token
    return true;
  }
}

export const tokenManager = TokenManager.getInstance();

// Deprecated functions, kept for compatibility
export function setAuthState(user: User | null, token: string | null): boolean {
  if (!user || !token) return false;
  return tokenManager.setToken(token, user);
}

export function clearAuthState(): void {
  tokenManager.clear();
}
