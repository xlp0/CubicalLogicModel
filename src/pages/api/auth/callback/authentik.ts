import type { APIRoute } from 'astro';
import { AUTHENTIK_CONFIG } from '../../../../config';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    const state = url.searchParams.get('state');

    console.log('[Auth Callback] Processing callback:', {
      hasCode: !!code,
      codeLength: code?.length,
      codePreview: code?.substring(0, 10) + '...',
      error,
      errorDescription,
      state,
      url: url.toString(),
      headers: Object.fromEntries(request.headers),
      searchParams: Object.fromEntries(url.searchParams),
    });

    if (error) {
      console.error('[Auth Callback] Error from Authentik:', {
        error,
        errorDescription,
        state,
      });
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/?error=' + encodeURIComponent(error) + 
            (errorDescription ? '&error_description=' + encodeURIComponent(errorDescription) : '')
        }
      });
    }

    if (!code) {
      console.error('[Auth Callback] No code received');
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/?error=no_code'
        }
      });
    }

    // Token exchange
    try {
      // Construct form data
      const formData = new URLSearchParams();
      formData.append('grant_type', 'authorization_code');
      formData.append('code', code);
      formData.append('redirect_uri', AUTHENTIK_CONFIG.redirectUri);
      formData.append('client_id', AUTHENTIK_CONFIG.clientId);
      formData.append('client_secret', AUTHENTIK_CONFIG.clientSecret);

      console.log('[Auth Callback] Token request details:', {
        url: AUTHENTIK_CONFIG.tokenUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        formData: {
          grant_type: 'authorization_code',
          code: code.substring(0, 10) + '...',
          redirect_uri: AUTHENTIK_CONFIG.redirectUri,
          client_id: AUTHENTIK_CONFIG.clientId.substring(0, 10) + '...',
          client_secret: '(hidden)'
        }
      });

      const tokenResponse = await fetch(AUTHENTIK_CONFIG.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formData.toString(),
      });

      let tokenData;
      const tokenText = await tokenResponse.text();
      
      try {
        tokenData = JSON.parse(tokenText);
      } catch (parseError) {
        console.error('[Auth Callback] Failed to parse token response:', {
          status: tokenResponse.status,
          text: tokenText,
          parseError
        });
        throw new Error('Invalid token response format');
      }

      console.log('[Auth Callback] Token response:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        headers: Object.fromEntries(tokenResponse.headers),
        error: tokenData.error,
        errorDescription: tokenData.error_description
      });

      if (!tokenResponse.ok) {
        console.error('[Auth Callback] Token exchange failed:', {
          status: tokenResponse.status,
          error: tokenData.error,
          description: tokenData.error_description,
        });
        throw new Error(tokenData.error_description || tokenData.error || 'Token exchange failed');
      }

      console.log('[Auth Callback] Token exchange successful:', {
        hasAccessToken: !!tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
      });

      // Get user info
      const userInfoResponse = await fetch(AUTHENTIK_CONFIG.userinfoUrl, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        },
      });

      if (!userInfoResponse.ok) {
        console.error('[Auth Callback] User info request failed:', {
          status: userInfoResponse.status,
          statusText: userInfoResponse.statusText,
        });
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await userInfoResponse.json();
      console.log('[Auth Callback] User info retrieved:', {
        sub: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        claims: Object.keys(userInfo),
      });

      // Get the domain from the request URL
      const domain = url.hostname;
      const isLocalhost = domain === 'localhost' || domain.startsWith('127.0.0.1');

      // Set secure cookies with proper domain
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // 7 days

      const cookieOptions = [
        'Path=/',
        isLocalhost ? '' : 'Secure',
        'SameSite=Lax',
        `Expires=${expires.toUTCString()}`
      ].filter(Boolean).join('; ');

      // Create user data with only necessary fields
      const userData = {
        name: userInfo.name || userInfo.preferred_username || userInfo.email,
        email: userInfo.email,
        id: userInfo.sub
      };

      // Create HTML with JavaScript redirect
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authenticating...</title>
            <script>
              function setCookie(name, value, options = {}) {
                options = {
                  path: '/',
                  ...options
                };

                if (options.expires instanceof Date) {
                  options.expires = options.expires.toUTCString();
                }

                let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

                for (let optionKey in options) {
                  updatedCookie += "; " + optionKey;
                  let optionValue = options[optionKey];
                  if (optionValue !== true) {
                    updatedCookie += "=" + optionValue;
                  }
                }

                document.cookie = updatedCookie;
              }

              // Set cookies
              const expires = new Date();
              expires.setDate(expires.getDate() + 7);

              setCookie('auth_token', '${encodeURIComponent(tokenData.access_token)}', {
                path: '/',
                expires: expires,
                samesite: 'lax'
              });

              setCookie('user', '${encodeURIComponent(JSON.stringify(userData))}', {
                path: '/',
                expires: expires,
                samesite: 'lax'
              });

              // Verify cookies were set
              const authToken = document.cookie.match(/auth_token=([^;]+)/);
              const userCookie = document.cookie.match(/user=([^;]+)/);

              if (authToken && userCookie) {
                console.log('✅ [Auth] Cookies set successfully');
                window.location.replace('/');
              } else {
                console.error('❌ [Auth] Failed to set cookies');
                window.location.replace('/?error=cookie_error');
              }
            </script>
          </head>
          <body>
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui, sans-serif;">
              <div style="text-align: center;">
                <h1 style="color: #4B5563; margin-bottom: 1rem;">Completing authentication...</h1>
                <p style="color: #6B7280;">Please wait while we redirect you.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Return HTML response with cookies
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

    } catch (authError) {
      console.error('[Auth Callback] Authentication error:', authError);
      if (authError instanceof Error) {
        console.error('[Auth Callback] Error details:', {
          name: authError.name,
          message: authError.message,
          stack: authError.stack,
        });
      }
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/?error=' + encodeURIComponent(authError.message || 'Authentication failed')
        }
      });
    }

  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', error);
    if (error instanceof Error) {
      console.error('[Auth Callback] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/?error=' + encodeURIComponent('Unexpected error during authentication')
      }
    });
  }
};
