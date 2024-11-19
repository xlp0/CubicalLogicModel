'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $authStore, tokenManager } from '../stores/authStore';
import { generateAuthUrl } from '../utils/auth';

export default function AuthButton() {
  const auth = useStore($authStore);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.group('🔐 [AuthButton] Initializing');
    
    // Comprehensive token validation
    console.log('🌐 Browser Environment:', {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      origin: window.location.origin
    });
    
    // Validate existing token
    const isTokenValid = tokenManager.validateToken();
    
    console.log('🔐 Token Validation:', {
      isValid: isTokenValid,
      hasUser: !!tokenManager.getUser()
    });

    // If token is valid, set loading to false
    setIsLoading(false);
    console.groupEnd();
  }, []); // Run only on mount

  const handleLogin = () => {
    console.group('🔐 [AuthButton] Login Process');
    console.log('Starting login redirect...');
    const loginUrl = generateAuthUrl();
    tokenManager.clear(); // Clear any existing state
    // Use replace to prevent back button issues
    window.location.replace(loginUrl);
    console.groupEnd();
  };

  const handleLogout = () => {
    console.group('🔐 [AuthButton] Logout Process');
    console.log('Clearing auth state...');
    tokenManager.clear();
    console.log('✅ Logout complete');
    console.groupEnd();
  };

  const buttonBaseStyle = "w-full text-left text-sm text-gray-200 hover:bg-gray-700/90 hover:text-white transition-colors";

  if (isLoading) {
    return (
      <button className={`${buttonBaseStyle} opacity-50 cursor-not-allowed`} disabled>
        Loading...
      </button>
    );
  }

  if (auth.isAuthenticated && auth.user) {
    return (
      <button className={buttonBaseStyle} onClick={handleLogout}>
        Logout ({auth.user.name})
      </button>
    );
  }

  return (
    <button className={buttonBaseStyle} onClick={handleLogin}>
      Login
    </button>
  );
}
