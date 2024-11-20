import type { APIRoute } from 'astro';
import { authDb } from '../../../utils/auth/sqlite';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false,
        reason: 'No token provided'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Find and delete any sessions with this token
    const sessions = authDb.getSessionsByToken(token);
    if (sessions.length > 0) {
      sessions.forEach(session => authDb.deleteSession(session.id));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[/api/auth/logout] Error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to logout'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
