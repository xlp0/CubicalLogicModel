import { AUTHENTIK_CONFIG } from '../config';

export interface AuthState {
  isAuthenticated: boolean;
  user?: any;
  error?: string;
}

// Get the appropriate redirect URI based on environment
function getRedirectUri(): string {
  return AUTHENTIK_CONFIG.redirectUri;
}

export function generateAuthUrl(): string {
  console.log('[Auth] Starting auth URL generation...');
  
  // Verify client ID is available
  if (!AUTHENTIK_CONFIG.clientId) {
    console.error('[Auth] Client ID is missing!');
    throw new Error('Client ID is required for authentication');
  }

  const redirectUri = getRedirectUri();
  
  // Log configuration without sensitive data
  console.log('[Auth] Auth config:', {
    baseUrl: AUTHENTIK_CONFIG.authorizationUrl,
    clientId: AUTHENTIK_CONFIG.clientId ? `${AUTHENTIK_CONFIG.clientId.substring(0, 4)}...` : 'MISSING',
    redirectUri: redirectUri,
    tokenUrl: AUTHENTIK_CONFIG.tokenUrl,
    userinfoUrl: AUTHENTIK_CONFIG.userinfoUrl
  });

  console.log('[Auth] Using redirect URI:', redirectUri);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: AUTHENTIK_CONFIG.clientId,
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    state: Math.random().toString(36).substring(7) // Add state for security
  });

  const fullUrl = `${AUTHENTIK_CONFIG.authorizationUrl}?${params.toString()}`;
  
  // Log URL with client ID redacted
  const logUrl = fullUrl.replace(AUTHENTIK_CONFIG.clientId, '${clientId}...');
  console.log('[Auth] Generated authorization URL:', logUrl);
  
  return fullUrl;
}