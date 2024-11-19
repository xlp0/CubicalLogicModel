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
    window.location.replace('/'); // Redirect to home page after logout
    console.log('✅ Logout complete');
    console.groupEnd();
  };

  // Styling for the button container
  const buttonContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  // Styling for the user display
  const userDisplayStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0,0,0,0.1)',  // Dark background for better contrast
    color: '#f4f4f4',  // Light text color for strong contrast
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    maxWidth: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    border: '1px solid rgba(255,255,255,0.2)',  // Subtle border for definition
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',  // Slight depth
  };

  // Styling for the button
  const buttonStyle = (isAuthenticated: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    textTransform: 'uppercase',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease',
    backgroundColor: isAuthenticated ? '#FF4D4D' : '#4A90E2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isLoading ? 0.5 : 1,
  });

  if (isLoading) {
    return (
      <div style={buttonContainerStyle}>
        <button 
          style={buttonStyle(false)} 
          disabled
        >
          Loading...
        </button>
      </div>
    );
  }

  if (auth.isAuthenticated && auth.user) {
    return (
      <div style={buttonContainerStyle}>
        <div style={userDisplayStyle}>
          {auth.user.name}
        </div>
        <button 
          style={buttonStyle(true)} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={buttonContainerStyle}>
      <button 
        style={buttonStyle(false)} 
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
