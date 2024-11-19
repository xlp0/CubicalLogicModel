import React, { useEffect, useState } from 'react';
import { generateAuthUrl, type AuthState } from '../utils/auth';

const parseCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
};

const AuthContent: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth] Component mounted');
    console.log('[Auth] Environment check:', {
      'PUBLIC_AUTHENTIK_CLIENT_ID exists': !!import.meta.env.PUBLIC_AUTHENTIK_CLIENT_ID,
      'import.meta.env keys': Object.keys(import.meta.env),
    });

    const checkAuthStatus = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const success = urlParams.get('success');

        console.log('[Auth] URL params:', {
          error,
          errorDescription,
          success,
          'all params': Object.fromEntries(urlParams.entries()),
        });

        // Check cookies first
        const userCookie = parseCookie('user');
        const authToken = parseCookie('auth_token');

        console.log('[Auth] Cookie check:', {
          hasUserCookie: !!userCookie,
          hasAuthToken: !!authToken,
          userCookie,
          authTokenLength: authToken?.length,
        });

        if (error) {
          console.error('[Auth] Error from callback:', error, errorDescription);
          setAuthState(prev => ({ 
            ...prev, 
            error: errorDescription || error,
            isAuthenticated: false,
          }));
          setIsLoading(false);
          return;
        }

        if (userCookie && authToken) {
          try {
            const user = JSON.parse(userCookie);
            console.log('[Auth] Parsed user cookie:', user);
            setAuthState({
              isAuthenticated: true,
              user,
              accessToken: authToken,
              error: null,
            });
          } catch (error) {
            console.error('[Auth] Error parsing user cookie:', error);
            setAuthState(prev => ({
              ...prev,
              error: 'Failed to parse user data',
              isAuthenticated: false,
            }));
          }
          setIsLoading(false);
          return;
        }

        if (success === 'true') {
          // Only retry a few times to prevent infinite loop
          const retryCount = parseInt(sessionStorage.getItem('auth_retry_count') || '0');
          if (retryCount < 3) {
            console.log('[Auth] Success param found but no cookies yet, retrying... (attempt ${retryCount + 1}/3)');
            sessionStorage.setItem('auth_retry_count', (retryCount + 1).toString());
            setTimeout(checkAuthStatus, 1000);
            return;
          } else {
            console.error('[Auth] Failed to get auth cookies after 3 retries');
            setAuthState(prev => ({
              ...prev,
              error: 'Failed to complete authentication',
              isAuthenticated: false,
            }));
          }
        }

        // If we get here, we're not authenticated
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          error: null,
        }));
        setIsLoading(false);
      } catch (error) {
        console.error('[Auth] Unexpected error in checkAuthStatus:', error);
        setAuthState(prev => ({
          ...prev,
          error: 'Unexpected error during authentication check',
          isAuthenticated: false,
        }));
        setIsLoading(false);
      }
    };

    // Clear retry count on mount
    sessionStorage.removeItem('auth_retry_count');
    checkAuthStatus();

    // Cleanup function to clear retry count
    return () => {
      sessionStorage.removeItem('auth_retry_count');
    };
  }, []);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('[Auth] Login button clicked');
    
    try {
      setIsLoading(true);
      const state = Math.random().toString(36).substring(7);
      console.log('[Auth] Generated state:', state);
      
      // Check environment variables before proceeding
      const clientId = import.meta.env.PUBLIC_AUTHENTIK_CLIENT_ID;
      if (!clientId) {
        throw new Error('Missing PUBLIC_AUTHENTIK_CLIENT_ID environment variable');
      }
      
      console.log('[Auth] Using client ID:', clientId);
      const authUrl = generateAuthUrl();

      // Log the exact URL we're redirecting to
      console.log('[Auth] Redirect URL:', {
        url: authUrl,
        parsed: new URL(authUrl),
        params: Object.fromEntries(new URL(authUrl).searchParams),
      });
      
      // Store state in sessionStorage for verification
      sessionStorage.setItem('auth_state', state);
      
      // Use window.location.assign for more reliable navigation
      window.location.assign(authUrl);
    } catch (error) {
      console.error('[Auth] Login error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initiate login',
      }));
      setIsLoading(false);
    }
  };

  console.log('[Auth] Rendering with state:', { authState, isLoading });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
        <p className="text-gray-400">Processing authentication...</p>
      </div>
    );
  }

  if (authState.error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          <p>Authentication Error: {authState.error}</p>
        </div>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (authState.isAuthenticated && authState.user) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Welcome, {authState.user.name || 'User'}!</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">Email:</span> {authState.user.email}</p>
            {authState.user.groups && (
              <p><span className="text-gray-400">Groups:</span> {authState.user.groups.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Authentication Required</h2>
        <p className="text-gray-400">Please log in to access this content</p>
      </div>
      <button
        onClick={handleLogin}
        type="button"
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        {isLoading ? 'Redirecting...' : 'Login with Authentik'}
      </button>
    </div>
  );
};

export default AuthContent;
