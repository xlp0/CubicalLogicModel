import type { APIRoute } from 'astro';
import { authDb } from '../../../utils/auth/sqlite';
import { config } from '../../../utils/config';

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        reason: 'No token provided'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Validate token with Authentik
    const userInfoResponse = await fetch(`${config.authentikBaseUrl}/application/o/userinfo/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userInfoResponse.ok) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        reason: 'Invalid token'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userInfo = await userInfoResponse.json();
    
    // Check if we have a valid session for this token
    const sessions = authDb.getSessionsByToken(token);
    if (sessions.length === 0) {
      // Create a new session
      const sessionId = authDb.createSession(token, userInfo.sub);
      if (!sessionId) {
        throw new Error('Failed to create session');
      }
    }

    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        groups: userInfo.groups || []
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[/api/auth/status] Error:', error);
    return new Response(JSON.stringify({ 
      authenticated: false,
      error: 'Failed to validate authentication'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
