# AuthentikatedSessionStore Specification

## Overview
The AuthentikatedSessionStore is an Astro-optimized session management system that integrates Authentik OAuth2/OpenID Connect authentication with SQLite-based session storage. Built specifically for Astro applications, it extends Astro's built-in session handling capabilities while providing secure, stateful session management.

**Important**: This implementation prioritizes server-side token management, storing session information in a secure SQLite database rather than relying on client-side cookies. This approach enhances security by minimizing client-side token exposure and reducing vulnerability to XSS and CSRF attacks.

## Security Considerations

### Token Management Strategy
- **Server-Side Storage**: Access and refresh tokens are stored exclusively in the server-side SQLite database
- **Bearer Token Authentication**: Uses HTTP Bearer token authentication scheme, passed via Authorization header
- **No Cookies**: This implementation explicitly avoids using cookies for any authentication or session management to prevent CSRF vulnerabilities
- **Token Rotation**: Implements automatic token rotation with secure server-side refresh token handling
- **Secure Token Transmission**: Uses secure headers and encrypted channels for token transmission

### Client-Side Implementation
- Client stores the access token securely in memory (not in localStorage or cookies)
- All API requests include the token in the Authorization header
- No session identifiers or tokens are ever stored in cookies or client-side storage
- Token is cleared from memory on logout or window close

### Stateful Sessions
- Session state is managed server-side, with only a minimal session identifier passed to the client
- Session state is stored in the SQLite database, with automatic cleanup of expired sessions

## Debugging and Logging

### Client-Side Logging
```typescript
// Example client-side logs
console.debug('[Auth] Initializing authentication handlers', {
  timestamp: new Date().toISOString()
});

console.debug('[Auth] Generated PKCE parameters:', {
  stateLength: state.length,
  verifierLength: codeVerifier.length,
  challengeLength: codeChallenge.length,
  timestamp: new Date().toISOString()
});

console.error('[Auth] Authentication error:', {
  message: error.message,
  context,
  timestamp: new Date().toISOString()
});
```

### Server-Side Logging
```typescript
// Example server-side logs
console.debug('[Auth] Processing request:', {
  method: request.method,
  url: request.url,
  hasAuthHeader: request.headers.has('Authorization'),
  timestamp: new Date().toISOString()
});

console.debug('[Auth] Valid session found:', {
  sessionId,
  expiresIn: Math.floor((expiresAt - now) / 1000),
  timestamp: new Date().toISOString()
});

console.error('[Auth] Token validation error:', {
  error,
  timestamp: new Date().toISOString()
});
```

### Log Categories
- **[Auth]**: Authentication flow events (both client and server)
- **[Debug]**: Detailed debug information
- **[Error]**: Error conditions and handling
- **[Token]**: Token operations and refresh events
- **[Session]**: Session lifecycle events
- **[PKCE]**: PKCE-related operations

### Authentication Event Logging
- **IndexedDB Storage**: Utilizes browser's IndexedDB to capture and store authentication events for debugging purposes
- **Event Timeline**: Maintains a chronological record of authentication flow events, state changes, and error conditions
- **Debug Data Structure**:
  ```typescript
  interface AuthDebugEvent {
    timestamp: number;
    eventType: 'auth_start' | 'auth_redirect' | 'token_received' | 'auth_error' | 'auth_complete';
    details: {
      state?: string;
      error?: string;
      flowId?: string;
      [key: string]: any;
    };
    metadata: {
      userAgent: string;
      timestamp: string;
      sessionId?: string;
    };
  }
  ```

### IndexedDB Schema
```typescript
interface AuthDebugStore {
  dbName: 'auth_debug_store';
  version: 1;
  stores: {
    events: {
      keyPath: 'timestamp';
      indexes: {
        eventType: string;
        flowId: string;
        timestamp: number;
      };
    };
    flows: {
      keyPath: 'flowId';
      indexes: {
        startTime: number;
        endTime: number;
      };
    };
  };
}
```

## Components

### 1. Authentication Flow
- **Astro-Enhanced PKCE OAuth2 Flow**
  - Integrates with Astro's routing system
  - Uses PKCE (Proof Key for Code Exchange) for enhanced security
  - Server-side state management
  - Token management without cookies

### 2. SQLite Session Store
- **Database Schema**
  ```sql
  -- Session Management
  CREATE TABLE auth_sessions (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    email TEXT,
    name TEXT,
    accessToken TEXT NOT NULL,
    refreshToken TEXT,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastActivity DATETIME,
    metadata TEXT
  );

  -- Authentication Flow State
  CREATE TABLE auth_states (
    state TEXT PRIMARY KEY,
    flowId TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    metadata TEXT
  );

  -- Debug Events
  CREATE TABLE auth_debug_events (
    id TEXT PRIMARY KEY,
    flowId TEXT NOT NULL,
    eventType TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    metadata TEXT
  );

  -- Performance Indexes
  CREATE INDEX idx_sessions_userId ON auth_sessions(userId);
  CREATE INDEX idx_sessions_expiresAt ON auth_sessions(expiresAt);
  CREATE INDEX idx_states_flowId ON auth_states(flowId);
  CREATE INDEX idx_states_expiresAt ON auth_states(expiresAt);
  CREATE INDEX idx_events_flowId ON auth_debug_events(flowId);
  CREATE INDEX idx_events_timestamp ON auth_debug_events(timestamp);
  ```

### Client API
```typescript
interface AuthClient {
  // Initialize the auth client with configuration
  init(config: AuthConfig): Promise<void>;
  
  // Start the authentication flow
  startAuth(): Promise<void>;
  
  // Handle the authentication callback
  handleCallback(params: URLSearchParams): Promise<void>;
  
  // Get the current authentication status
  getStatus(): Promise<AuthStatus>;
  
  // Debug utilities
  debug: {
    exportEvents(flowId?: string): Promise<AuthDebugEvent[]>;
    clearEvents(): Promise<void>;
    getEventTimeline(flowId: string): Promise<AuthDebugEvent[]>;
  };
}

interface AuthConfig {
  authentikUrl: string;
  clientId: string;
  redirectUri: string;
  debug?: boolean;
}

interface AuthStatus {
  authenticated: boolean;
  sessionId?: string;
  error?: string;
}
```

### Server API
```typescript
interface AuthMiddleware {
  // Validate and process authentication requests
  authenticateRequest(context: APIContext): Promise<AuthenticatedRequest | null>;
  
  // Manage sessions
  createSession(user: User, tokens: TokenResponse): Promise<Session>;
  validateSession(sessionId: string): Promise<Session | null>;
  refreshSession(sessionId: string): Promise<boolean>;
  
  // Debug utilities
  debug: {
    getSessionEvents(sessionId: string): Promise<AuthDebugEvent[]>;
    getFlowEvents(flowId: string): Promise<AuthDebugEvent[]>;
    exportDebugData(): Promise<DebugData>;
  };
}

interface Session {
  id: string;
  userId: string;
  email?: string;
  name?: string;
  expiresAt: Date;
  lastActivity: Date;
  metadata: Record<string, any>;
}
```

## Configuration Management

The application uses a centralized configuration management system located at `/src/utils/config.ts`. This is the **single source of truth** for all configuration values and environment variables.

### Key Features

1. **Singleton Pattern**: Ensures consistent configuration across the application
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Validation**: Built-in validation for required configuration values
4. **Environment Variables**: Proper handling of all environment variables
5. **Error Handling**: Comprehensive error handling and logging

### Usage

```typescript
import { config } from '../utils/config';

// Access configuration values
const baseUrl = config.authentikBaseUrl;
const clientId = config.authentikClientId;

// Use helper methods
const redirectUri = config.getRedirectUri(requestUrl);
```

### Environment Variables

Required variables:
- `PUBLIC_AUTHENTIK_BASE_URL`: Base URL of your Authentik instance
- `PUBLIC_AUTHENTIK_CLIENT_ID`: Client ID from Authentik
- `PUBLIC_AUTHENTIK_APPLICATION_SLUG`: Application slug in Authentik

Optional variables:
- `AUTHENTIK_CLIENT_SECRET`: Client secret for token refresh
- `PUBLIC_AUTHENTIK_REDIRECT_URI`: Custom redirect URI (defaults to /api/auth/callback)

### Important Note

The configuration is centralized in `/src/utils/config.ts`. Do not create additional configuration files or import environment variables directly. All configuration access should go through this central utility.

## Concrete Implementation

### Core Components

#### 1. SQLite Session Store (`src/utils/auth/sqlite.ts`)
- **Implementation**: Singleton pattern using `better-sqlite3`
- **Key Features**:
  - Server-side session management
  - Token storage and rotation
  - PKCE state management
  - Debug event logging
- **Tables**:
  - `auth_sessions`: Stores active user sessions and tokens
  - `auth_states`: Manages PKCE flow state and code verifiers
  - `auth_debug_events`: Logs authentication events with metadata
- **Security**:
  - No client-side token storage
  - Automatic session cleanup
  - Token rotation on refresh
  - Secure user info retrieval from Authentik

#### 2. Debug Manager (`src/utils/auth/debug-store.ts`)
- **Implementation**: Client-side IndexedDB store
- **Key Features**:
  - Event timeline tracking
  - Flow-based event grouping
  - Exportable debug data
- **Stores**:
  - `events`: Chronological event log with metadata
  - `flows`: Authentication flow tracking
- **Capabilities**:
  - Timeline reconstruction
  - Flow analysis
  - Error tracking
  - Performance monitoring

#### 3. PKCE Implementation (`src/utils/auth/pkce.ts`)
- **Implementation**: Cryptographic utility for OAuth2 PKCE flow
- **Key Features**:
  - Secure code verifier generation using `crypto.randomBytes`
  - SHA-256 code challenge generation
  - Base64URL-safe encoding
  - RFC 7636 compliant implementation
- **Functions**:
  - `generatePKCE()`: Generates PKCE parameters
    - Returns `codeVerifier` (random, base64URL-encoded string)
    - Returns `codeChallenge` (SHA-256 hash of verifier)
- **Security**:
  - Cryptographically secure random generation
  - Standard-compliant hashing
  - URL-safe character encoding
  - Proper string length handling

#### 4. UI Components

##### AuthButton Component (`src/components/AuthButton.astro`)
- **Implementation**: Astro component with client-side interactivity
- **Key Features**:
  - Dynamic state management
  - Token-based authentication
  - Automatic status updates
  - Clean UI/UX
- **Functionality**:
  - Displays login/logout state
  - Shows user information when logged in
  - Handles authentication flow
  - Manages session storage
- **Integration**:
  - Connects with auth API endpoints
  - Uses session storage for tokens
  - Supports dark mode
  - Customizable styling
- **Security**:
  - Token-based authentication
  - Secure session management
  - Proper error handling
  - Status verification

#### 5. Authentication Endpoints

##### Login Endpoint (`src/pages/api/auth/login.ts`)
- Initiates OAuth2 flow with PKCE
- Generates and stores PKCE parameters
- Redirects to Authentik login

##### Callback Handler (`src/pages/api/auth/callback/authentik.ts`)
- Processes OAuth2 callback
- Validates PKCE parameters
- Exchanges code for tokens
- Creates server-side session

##### Status Endpoint (`src/pages/api/auth/status.ts`)
- Validates current session
- Returns user authentication state
- Handles token refresh

##### Logout Endpoint (`src/pages/api/auth/logout.ts`)
- Terminates server-side session
- Cleans up associated data
- Handles Authentik logout

### Security Implementation

#### Token Management
- Access tokens stored only in server-side SQLite database
- Refresh tokens managed with secure rotation
- No client-side token storage
- Bearer token authentication via headers

#### PKCE Implementation
- Code verifier generated with cryptographic randomness
- Code challenge using SHA-256
- State parameter for CSRF protection
- Secure storage of PKCE parameters

#### Session Security
- Server-side session state
- Automatic session expiration
- Activity tracking
- Secure token transmission

### Debugging Capabilities

#### Server-Side Logging
- Comprehensive event logging in SQLite
- Session lifecycle tracking
- Token rotation events
- Error logging with context

#### Client-Side Debugging
- IndexedDB event store
- Timeline reconstruction
- Flow analysis tools
- Export capabilities

### Integration Points

#### Authentik Integration
- OAuth2/OpenID Connect flow
- User information retrieval
- Group membership handling
- Token lifecycle management

#### Astro Integration
- API route handlers
- Server-side rendering support
- Client-side components
- Security middleware

## Usage Example

### AuthButton Component
The `AuthButton.astro` component provides a dynamic authentication button that changes its appearance and behavior based on the user's authentication state. It displays the user's name or email when logged in and handles both login and logout actions.

```astro
<!-- src/components/AuthButton.astro -->
<button
  class:list={[
    "px-4 py-2 rounded-lg transition-colors",
    isAuthenticated 
      ? "bg-green-600 hover:bg-green-700" 
      : "bg-blue-600 hover:bg-blue-700",
  ]}
>
  {isAuthenticated 
    ? `Logged in as ${user.name || user.email}` 
    : "Sign In"}
</button>
```

### Integration Example
Here's how to use the AuthButton component in a page:

```astro
<!-- src/pages/index.astro -->
---
import Layout from '../layouts/Layout.astro';
import AuthButton from '../components/AuthButton.astro';

// Get authentication status
const response = await fetch(`${Astro.url.origin}/api/auth/status`, {
  headers: {
    Authorization: `Bearer ${Astro.cookies.get('auth_token')?.value || ''}`
  }
});
const { isAuthenticated, user } = await response.json();
---

<Layout title="Welcome">
  <main class="container mx-auto px-4 py-8">
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-4xl font-bold mb-8">Welcome to Our App</h1>
      
      <div class="flex flex-col items-center space-y-4">
        <AuthButton />
        
        {isAuthenticated && user && (
          <div class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 class="text-xl font-semibold mb-2">User Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  </main>
</Layout>
```

This example demonstrates:
- Server-side authentication status check
- Dynamic button appearance based on auth state
- Display of user information when authenticated
- Secure token handling through cookies
- Responsive design with Tailwind CSS

## API

### Astro Integration API
```typescript
// Astro integration configuration
export default defineConfig({
  integrations: [
    authentikatedSessionStore({
      databasePath: './data/session.db',
      logLevel: 'debug', // Controls logging verbosity
      sessionOptions: {
        // Astro session configuration
        cookieName: 'session',
        expires: 24 * 60 * 60, // 1 day
      }
    })
  ]
});
```

### Client-Side Functions

#### `generatePKCEPair()`
```typescript
interface PKCEPair {
  state: string;
  codeVerifier: string;
  codeChallenge: string;
}

async function generatePKCEPair(): Promise<PKCEPair>
```

#### `handleLogin()`
```typescript
async function handleLogin(e?: Event): Promise<void>
```

### Server-Side Functions

#### `validateSession()`
```typescript
interface Session {
  userId: string;
  email?: string;
  name?: string;
  accessToken: string;
  expiresAt: Date;
}

async function validateSession(sessionId: string): Promise<Session | null>
```

#### `refreshToken()`
```typescript
async function refreshToken(sessionId: string): Promise<boolean>
```

## Error Handling

### Error Types
1. **AuthenticationError**: For auth-related failures
2. **SessionError**: For session management issues
3. **DatabaseError**: For SQLite operation failures

### Error Responses
- Proper status codes (401, 403, 500)
- Structured error messages
- Secure error information (no sensitive data exposure)

## Performance Considerations

### Database Optimizations
- Indexed queries for session lookups
- Periodic cleanup of expired sessions
- Connection pooling for better performance

### Caching Strategy
- In-memory session cache
- Token caching with proper invalidation
- State parameter short-term caching

## Implementation Notes

### Debug Mode
- Extensive logging in both client and server
- Log categorization for easy filtering
- Performance timing logs
- Error stack traces in development
- Request/response logging for auth operations

### Development Tools
- Browser console formatting for readability
- Log level configuration
- Performance monitoring
- Session state inspection tools
- Authentication flow visualization

### Future Improvements
1. Redis caching integration
2. Session analytics and monitoring
3. Multi-device session management
4. Enhanced security event logging
5. GraphQL-based session inspection
6. Real-time session monitoring dashboard

## Configuration

### Environment Variables
Authentik configuration is stored in a `.env` file at the root level of the project. The following variables must be defined:

```shell
# Authentik Client Credentials
AUTHENTIK_CLIENT_SECRET=your_client_secret_here
PUBLIC_AUTHENTIK_CLIENT_ID=your_client_id_here

# Authentik URLs
PUBLIC_AUTHENTIK_BASE_URL=https://your.authentik.instance
PUBLIC_AUTHENTIK_APPLICATION_SLUG=your_application_slug

# Optional: Override default redirect URI
# PUBLIC_AUTHENTIK_REDIRECT_URI=http://your-domain.com/api/auth/callback/authentik
```

#### Environment Variable Conventions
- Variables prefixed with `PUBLIC_` are accessible in both client and server code
- Non-public variables (e.g., `AUTHENTIK_CLIENT_SECRET`) are only accessible server-side
- Default redirect URI is `http://localhost:4321/api/auth/callback/authentik` in development
- All URLs should be provided without trailing slashes

### Configuration Loading
The environment variables are loaded and validated in `src/config.ts`:

```typescript
interface AuthentikConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  applicationSlug: string;
  redirectUri: string;
  userinfoUrl: string;
}

export const AUTHENTIK_CONFIG: AuthentikConfig = {
  baseUrl: import.meta.env.PUBLIC_AUTHENTIK_BASE_URL,
  clientId: import.meta.env.PUBLIC_AUTHENTIK_CLIENT_ID,
  clientSecret: import.meta.env.AUTHENTIK_CLIENT_SECRET,
  applicationSlug: import.meta.env.PUBLIC_AUTHENTIK_APPLICATION_SLUG,
  redirectUri: import.meta.env.PUBLIC_AUTHENTIK_REDIRECT_URI 
    || `${import.meta.env.SITE}/api/auth/callback/authentik`,
  userinfoUrl: `${import.meta.env.PUBLIC_AUTHENTIK_BASE_URL}/application/o/userinfo/`
};
```

### Astro Configuration
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import authentikatedSessionStore from './integrations/authentikated-session-store';

export default defineConfig({
  output: 'server', // Required for session support
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    authentikatedSessionStore({
      // Configuration options
    })
  ]
});
```

### Database Configuration
- SQLite database location: `./data/session.db`
- Connection pooling enabled
- Write-ahead logging (WAL) mode
- Foreign key constraints enforced
- Automatic cleanup of expired sessions
- Debug event retention: 7 days
