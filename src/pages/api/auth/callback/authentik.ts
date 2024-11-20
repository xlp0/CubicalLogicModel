import type { APIRoute } from 'astro';
import { config } from '../../../../utils/config';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    // Check for errors
    if (error) {
      console.error('[/api/auth/callback/authentik] Auth error:', error, errorDescription);
      return new Response(JSON.stringify({ 
        success: false, 
        error,
        details: errorDescription 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required parameters
    if (!code || !state) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing required parameters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get auth state from database
    const { authDb } = await import('../../../../utils/auth/sqlite');
    const authState = authDb.getAuthState(state);
    if (!authState) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid or expired state'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(`${config.authentikBaseUrl}/application/o/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.authentikClientId,
        code_verifier: authState.codeVerifier,
        code,
        redirect_uri: config.getRedirectUri(request.url),
        ...(config.authentikClientSecret && {
          client_secret: config.authentikClientSecret
        })
      })
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('[/api/auth/callback/authentik] Token exchange failed:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Failed to exchange code for token'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tokens = await tokenResponse.json();
    
    // Create session
    const sessionId = await authDb.createSession(
      tokens.access_token,
      tokens.sub || 'unknown',
      tokens.refresh_token
    );

    // Log debug event
    await authDb.createAuthDebugEvent({
      eventType: 'auth_complete',
      details: {
        flowId: authState.flowId,
        timestamp: new Date().toISOString()
      },
      metadata: {
        userAgent: request.headers.get('User-Agent') || 'unknown',
        sessionId
      }
    });

    // Set session token in sessionStorage and redirect to home
    const html = `
      <html>
        <body>
          <script>
            sessionStorage.setItem('auth_token', '${tokens.access_token}');
            window.location.href = '/';
          </script>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } catch (error) {
    console.error('[/api/auth/callback/authentik] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to complete authentication',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
