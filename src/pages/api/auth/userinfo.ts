import type { APIRoute } from 'astro';
import { AUTHENTIK_CONFIG } from '../../../config';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user info from Authentik
    const userResponse = await fetch(AUTHENTIK_CONFIG.userinfoUrl, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    const data = await userResponse.text();
    const status = userResponse.status;

    return new Response(data, {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('[UserInfo] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
