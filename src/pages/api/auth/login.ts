import type { APIRoute } from 'astro';
import { generatePKCE } from '../../../utils/auth/pkce';
import { config } from '../../../utils/config';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Generate PKCE parameters
    const { codeVerifier, codeChallenge } = await generatePKCE();
    
    // Store PKCE parameters in session for later verification
    const state = crypto.randomUUID();
    const session = {
      state,
      codeVerifier,
      timestamp: Date.now()
    };

    // Build authorization URL
    const redirectUri = config.getRedirectUri(request.url);
    console.debug('[/api/auth/login] Using redirect URI:', redirectUri);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.authentikClientId,
      redirect_uri: redirectUri,
      scope: 'openid profile email',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${config.authentikBaseUrl}/application/o/authorize/?${params}`;
    console.debug('[/api/auth/login] Full authorization URL:', authUrl);

    // Store session data in SQLite
    const { authDb } = await import('../../../utils/auth/sqlite');
    try {
      const flowId = crypto.randomUUID();
      await authDb.createAuthState(state, codeVerifier);
      await authDb.createAuthDebugEvent({
        eventType: 'auth_start',
        details: {
          state,
          flowId,
          timestamp: new Date().toISOString()
        },
        metadata: {
          userAgent: request.headers.get('User-Agent') || 'unknown'
        }
      });
    } catch (dbError) {
      console.error('[/api/auth/login] Database error:', dbError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Failed to store authentication state'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Redirect to authorization URL
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl,
      }
    });
  } catch (error) {
    console.error('[/api/auth/login] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to initiate login',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
