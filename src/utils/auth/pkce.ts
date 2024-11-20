import { createHash, randomBytes } from 'crypto';

/**
 * Generates PKCE parameters for OAuth2 authentication
 * @returns Promise<{codeVerifier: string, codeChallenge: string}>
 */
export async function generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  // Generate code verifier
  const codeVerifier = randomBytes(32)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 128);

  // Generate code challenge
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return { codeVerifier, codeChallenge };
}
