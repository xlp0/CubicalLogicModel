import type { APIRoute } from 'astro';
import CardDbService from '../../utils/cardDbService';

// Explicitly disable prerendering for API routes
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  let dbService: CardDbService | null = null;
  
  try {
    console.group('[API] Request Debug');
    const url = new URL(request.url);
    const rawQuery = url.searchParams.get('q');
    
    console.log('[API] Request URL:', url.toString());
    console.log('[API] Search query:', rawQuery);
    console.groupEnd();

    if (rawQuery && rawQuery.length < 2) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Search query must be at least 2 characters long',
        cards: []
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    dbService = new CardDbService();
    const cards = dbService.searchCards(rawQuery || '');
    console.log('[API] Found cards:', cards.length);

    return new Response(JSON.stringify({
      success: true,
      cards
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cards: []
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } finally {
    if (dbService) {
      dbService.close();
    }
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};
