import React, { useEffect } from 'react';
import { tokenManager } from '../stores/authStore';

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      console.group('🔐 AuthCallback: Processing Authentication');
      try {
        // Diagnostic logging for browser environment
        console.log('🌐 Browser Environment:', {
          protocol: window.location.protocol,
          hostname: window.location.hostname,
          origin: window.location.origin
        });
        
        // Extract code and state from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        console.log('🔍 URL Parameters:', { 
          code: code ? 'Present' : 'Missing', 
          state: state ? 'Present' : 'Missing' 
        });

        if (!code) {
          console.error('❌ [AuthCallback] No authorization code found');
          window.location.replace('/?error=no_code');
          return;
        }

        console.log('🚀 Attempting token exchange...');
        const tokenResponse = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            redirect_uri: window.location.origin + '/api/auth/callback/authentik'
          })
        });

        console.log('📡 Token Request:', {
          status: tokenResponse.status,
          ok: tokenResponse.ok
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('❌ [AuthCallback] Token request failed:', errorText);
          window.location.replace(`/?error=token_error&details=${encodeURIComponent(errorText)}`);
          return;
        }

        const tokenData = await tokenResponse.json();
        console.log('🔑 Token Data:', { 
          accessTokenLength: tokenData.access_token?.length || 0 
        });

        if (!tokenData.access_token) {
          console.error('❌ [AuthCallback] No access token in response:', tokenData);
          window.location.replace('/?error=no_token');
          return;
        }

        // Get user info
        console.log('👤 Fetching user info...');
        const userResponse = await fetch('/api/auth/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });

        console.log('📡 User Info Request:', {
          status: userResponse.status,
          ok: userResponse.ok
        });

        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          console.error('❌ [AuthCallback] User info request failed:', errorText);
          window.location.replace(`/?error=userinfo_error&details=${encodeURIComponent(errorText)}`);
          return;
        }

        const userData = await userResponse.json();
        console.log('👤 User Data:', { 
          email: userData.email ? 'Present' : 'Missing',
          sub: userData.sub ? 'Present' : 'Missing'
        });

        if (!userData.email || !userData.sub) {
          console.error('❌ [AuthCallback] Invalid user data:', userData);
          window.location.replace('/?error=invalid_user_data');
          return;
        }

        // Prepare user object
        const user = {
          name: userData.name || userData.preferred_username || userData.email,
          email: userData.email,
          id: userData.sub
        };

        // Use TokenManager to set token
        const { token, user: tokenUser, expiresIn } = {
          token: tokenData.access_token,
          user,
          expiresIn: tokenData.expires_in
        };

        console.log('🔑 Authentication Details:', { 
          hasToken: !!token, 
          hasUser: !!tokenUser,
          expiresIn: expiresIn || 'Not specified'
        });

        // Validate received details
        if (!token || !tokenUser) {
          console.error('❌ Invalid authentication response');
          window.location.replace('/?error=invalid_auth_response');
          return;
        }

        // Set token using TokenManager with optional expiry
        const tokenSet = tokenManager.setToken(token, tokenUser, expiresIn);
        
        console.log('🔐 Token Management:', {
          tokenSet,
          isValid: tokenManager.validateToken(),
          hasUser: !!tokenManager.getUser()
        });

        if (!tokenSet) {
          console.error('❌ Failed to set authentication token');
          window.location.replace('/?error=token_storage_failed');
          return;
        }

        // Navigate to the intended destination
        console.log('🏠 Redirecting to home page...');
        window.location.replace('/');
        console.groupEnd();
      } catch (error) {
        console.error('❌ Authentication Callback Error:', error);
        window.location.replace(`/?error=${encodeURIComponent(error.message)}`);
        console.groupEnd();
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      <p className="mt-4 text-xl text-gray-300">Completing your sign in...</p>
    </div>
  );
}
