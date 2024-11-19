#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Path to cookies
const userCookiePath = path.join(process.env.HOME, '.gasing_user_cookie.json');
const tokenCookiePath = path.join(process.env.HOME, '.gasing_auth_token.json');

function checkLoginStatus() {
  try {
    // Check if cookie files exist
    const userCookieExists = fs.existsSync(userCookiePath);
    const tokenCookieExists = fs.existsSync(tokenCookiePath);

    if (userCookieExists && tokenCookieExists) {
      const userCookie = JSON.parse(fs.readFileSync(userCookiePath, 'utf8'));
      console.log('Logged In ✅');
      console.log('User Details:');
      console.log('- Name:', userCookie.name);
      console.log('- Email:', userCookie.email);
      return true;
    } else {
      console.log('Not Logged In ❌');
      return false;
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
}

// Run the check
checkLoginStatus();
