/**
 * Configuration utility class for managing environment variables and application settings
 */
export class Config {
  private static instance: Config;
  private readonly env: Record<string, string>;

  private constructor() {
    this.env = {
      AUTHENTIK_BASE_URL: import.meta.env.PUBLIC_AUTHENTIK_BASE_URL,
      AUTHENTIK_CLIENT_ID: import.meta.env.PUBLIC_AUTHENTIK_CLIENT_ID,
      AUTHENTIK_CLIENT_SECRET: import.meta.env.AUTHENTIK_CLIENT_SECRET,
      AUTHENTIK_REDIRECT_URI: import.meta.env.PUBLIC_AUTHENTIK_REDIRECT_URI,
    };

    // Validate required environment variables
    this.validateConfig();
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private validateConfig(): void {
    const requiredVars = ['AUTHENTIK_BASE_URL', 'AUTHENTIK_CLIENT_ID'];
    const missingVars = requiredVars.filter(varName => !this.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  public get authentikBaseUrl(): string {
    return this.env.AUTHENTIK_BASE_URL;
  }

  public get authentikClientId(): string {
    return this.env.AUTHENTIK_CLIENT_ID;
  }

  public get authentikClientSecret(): string | undefined {
    return this.env.AUTHENTIK_CLIENT_SECRET;
  }

  public get authentikRedirectUri(): string | undefined {
    return this.env.AUTHENTIK_REDIRECT_URI;
  }

  public getRedirectUri(requestUrl: string): string {
    if (this.authentikRedirectUri) {
      console.debug('[Config] Using configured redirect URI:', this.authentikRedirectUri);
      return this.authentikRedirectUri;
    }

    // If no redirect URI is configured, construct one from the request URL
    const url = new URL(requestUrl);
    const baseUrl = `${url.protocol}//${url.host}`;
    const redirectUri = `${baseUrl}/api/auth/callback/authentik`;
    console.debug('[Config] Generated redirect URI:', redirectUri, 'from request URL:', requestUrl);
    return redirectUri;
  }
}

// Export singleton instance
export const config = Config.getInstance();
