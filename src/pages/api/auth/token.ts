import type { APIRoute } from 'astro';
import { AUTHENTIK_CONFIG } from '../../../config';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { code, redirect_uri } = body;

    if (!code) {
      return new Response(JSON.stringify({ error: 'No code provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Exchange code for token
    const tokenResponse = await fetch(AUTHENTIK_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri || AUTHENTIK_CONFIG.redirectUri,
        client_id: AUTHENTIK_CONFIG.clientId,
        client_secret: AUTHENTIK_CONFIG.clientSecret
      }).toString()
    });

    const data = await tokenResponse.text();
    const status = tokenResponse.status;

    return new Response(data, {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('[Token] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
