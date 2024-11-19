// Default redirect URI that matches Authentik's configuration
const DEFAULT_REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/api/auth/callback/authentik`
  : 'http://localhost:4321/api/auth/callback/authentik';

// Get client secret from environment
const getClientSecret = () => {
  const secret = import.meta.env.AUTHENTIK_CLIENT_SECRET;
  if (!secret) {
    console.error('[Config] Missing AUTHENTIK_CLIENT_SECRET environment variable');
    console.error('[Config] Please ensure .env file exists and contains AUTHENTIK_CLIENT_SECRET');
    console.error('[Config] Current environment:', import.meta.env);
    return '';
  }
  return secret.trim(); // Remove any whitespace
};

// Get client ID from environment
const getClientId = () => {
  const clientId = import.meta.env.PUBLIC_AUTHENTIK_CLIENT_ID;
  if (!clientId) {
    console.error('[Config] Missing PUBLIC_AUTHENTIK_CLIENT_ID environment variable');
    console.error('[Config] Please ensure .env file exists and contains PUBLIC_AUTHENTIK_CLIENT_ID');
    console.error('[Config] Current environment:', import.meta.env);
    return '';
  }
  return clientId.trim(); // Remove any whitespace
};

// Debug function to check credentials
const debugCredentials = () => {
  const clientId = getClientId();
  const secret = getClientSecret();
  
  console.group('[Config] Authentication Credentials');
  console.log('Client ID:', clientId ? `${clientId.substring(0, 4)}...${clientId.slice(-4)}` : 'MISSING');
  console.log('Client Secret:', secret ? `${secret.substring(0, 4)}...${secret.slice(-4)}` : 'MISSING');
  console.log('Client ID length:', clientId.length);
  console.log('Client Secret length:', secret.length);
  console.log('Redirect URI:', DEFAULT_REDIRECT_URI);
  
  if (!clientId || !secret) {
    console.error('[Config] Missing credentials - Client ID or Secret is undefined');
    console.error('[Config] Please check your .env file and ensure all required variables are set');
  }
  console.groupEnd();
};

// Run debug check
if (typeof window !== 'undefined') {
  debugCredentials();
}

// Export configuration with validation
export const AUTHENTIK_CONFIG = {
  authorizationUrl: 'https://auth.pkc.pub/application/o/authorize/',
  tokenUrl: 'https://auth.pkc.pub/application/o/token/',
  userinfoUrl: 'https://auth.pkc.pub/application/o/userinfo/',
  logoutUrl: 'https://auth.pkc.pub/application/o/gasing-pkc/end-session/',
  jwksUrl: 'https://auth.pkc.pub/application/o/gasing-pkc/jwks/',
  issuer: 'https://auth.pkc.pub/application/o/gasing-pkc/',
  clientId: getClientId(),
  clientSecret: getClientSecret(),
  redirectUri: DEFAULT_REDIRECT_URI,
};
