# AuthProvider Architecture Documentation

## Overview

The AuthProvider is a React Context-based authentication system that provides centralized user authentication state management across the entire application. It wraps the app components and provides authentication methods and user session data to any component that needs it.

## Architecture Components

### 1. AuthProvider Context (`src/app/_providers/AuthProvider.tsx`)

```typescript
interface AuthContextType {
  user: UserDoc | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
}
```

**Key Features:**
- **Global State Management**: Maintains user authentication state across the entire app
- **Session Persistence**: Automatically checks for existing sessions on app initialization
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Consistent error handling across all authentication operations

### 2. Integration in App Layout (`src/app/layout.tsx`)

```typescript
// Provider hierarchy in layout.tsx
<AppRouterCacheProvider>
  <LocaleProvider>
    <AppThemeBridge>
      <AuthProvider>  // ← Authentication wrapper
        <I18nProvider>
          {children}
        </I18nProvider>
      </AuthProvider>
    </AppThemeBridge>
  </LocaleProvider>
</AppRouterCacheProvider>
```

**Position in Provider Stack:**
- Placed after theme providers but before i18n provider
- Ensures authentication state is available to all child components
- Wraps the entire application for global accessibility

## Core Functionality

### 1. Session Management

```typescript
// Automatic session checking on app load
useEffect(() => {
  checkAuth();
}, []);

const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Authentication Methods

#### Login Method
```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await loginUser(email, password);
    if (response.success && response.user) {
      setUser(response.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};
```

#### Signup Method
```typescript
const signup = async (data: SignupData) => {
  try {
    const response = await signupUser(data);
    if (response.success && response.user) {
      setUser(response.user);
      return { success: true };
    }
    return { success: false, error: response.error };
  } catch (error) {
    return { success: false, error: 'Signup failed' };
  }
};
```

#### Logout Method
```typescript
const logout = async () => {
  try {
    await logoutUser();
    setUser(null);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Usage Patterns

### 1. Using the useAuth Hook

```typescript
import { useAuth } from '@/app/_providers/AuthProvider';

function MyComponent() {
  const { user, isLoading, login, logout } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Protected Route Pattern

```typescript
function ProtectedComponent() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <DashboardContent />;
}
```

### 3. Role-Based Access Control

```typescript
function AdminPanel() {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }
  
  return <AdminDashboard />;
}
```

## Integration Points

### 1. UserMenu Component (`src/app/_components/main/UserMenu.tsx`)

```typescript
export default function UserMenu() {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  return (
    <Menu>
      {user ? (
        <>
          <MenuItem>{user.name}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      ) : (
        <MenuItem href="/login">Login</MenuItem>
      )}
    </Menu>
  );
}
```

### 2. Dashboard Layout (`src/app/(main)/layout.tsx`)

```typescript
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div>
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  );
}
```

## Backend Integration

### 1. API Route Structure

```
/api/auth/
├── login/route.ts     - POST: User authentication
├── signup/route.ts    - POST: User registration  
├── logout/route.ts    - POST: Session termination
└── me/route.ts        - GET: Current user session
```

### 2. Session Management with iron-session

```typescript
// lib/auth.ts
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'pathfinder-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
```

## State Flow Diagram

```
App Initialization
       ↓
   AuthProvider Mounts
       ↓
   checkAuth() Called
       ↓
   Fetch /api/auth/me
       ↓
   ┌─────────────────┐
   │ Session Exists? │
   └─────────────────┘
       ↓           ↓
    Yes │          │ No
       ↓           ↓
   Set User    Set user = null
       ↓           ↓
   App Ready   Show Login
```

## Security Features

### 1. Cookie-Based Sessions
- HttpOnly cookies prevent XSS attacks
- Secure flag in production
- Automatic expiration (30 days)

### 2. Password Security
- bcryptjs hashing with salt rounds
- No plain text password storage
- Secure password validation

### 3. Session Validation
- Server-side session verification
- Automatic session refresh
- Secure logout with session cleanup

## Error Handling

### 1. Network Errors
```typescript
const login = async (email: string, password: string) => {
  try {
    // API call
  } catch (error) {
    if (error instanceof TypeError) {
      return { success: false, error: 'Network error' };
    }
    return { success: false, error: 'Login failed' };
  }
};
```

### 2. Authentication Errors
```typescript
// API responses include specific error messages
{
  success: false,
  error: "Invalid credentials"
}
```

## Performance Considerations

### 1. Loading States
- `isLoading` prevents flash of unauthenticated content
- Graceful loading indicators during auth checks

### 2. Memory Management
- Automatic cleanup on unmount
- Efficient state updates with React's built-in optimization

### 3. Network Optimization
- Single auth check on app initialization
- Cached user data until logout

## Development & Debugging

### 1. Debug Utilities (`lib/debug.ts`)
```typescript
export const AUTH_DEBUG = process.env.NODE_ENV === 'development';

export function debugAuth(message: string, data?: any) {
  if (AUTH_DEBUG) {
    console.log(`[AUTH] ${message}`, data);
  }
}
```

### 2. Environment Variables
```env
SESSION_SECRET=your-32-character-secret-key
MONGODB_URI=mongodb://localhost:27017/pathfinder
NODE_ENV=development
```

## Best Practices

### 1. **Always Check Loading State**
```typescript
const { user, isLoading } = useAuth();
if (isLoading) return <LoadingSpinner />;
```

### 2. **Handle All Authentication States**
```typescript
// Loading, Authenticated, Unauthenticated
if (isLoading) return <Loading />;
if (!user) return <LoginPrompt />;
return <AuthenticatedContent />;
```

### 3. **Use TypeScript for Type Safety**
```typescript
const { user }: { user: UserDoc | null } = useAuth();
```

### 4. **Implement Proper Error Boundaries**
```typescript
<ErrorBoundary fallback={<AuthError />}>
  <AuthProvider>
    <App />
  </AuthProvider>
</ErrorBoundary>
```

## Testing Strategies

### 1. Unit Tests for AuthProvider
```typescript
test('login sets user on success', async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });
  
  await act(async () => {
    await result.current.login('test@example.com', 'password');
  });
  
  expect(result.current.user).toBeTruthy();
});
```

### 2. Integration Tests
```typescript
test('protected route redirects when not authenticated', () => {
  render(
    <AuthProvider>
      <ProtectedComponent />
    </AuthProvider>
  );
  
  expect(screen.getByText('Please log in')).toBeInTheDocument();
});
```

## Summary

The AuthProvider architecture provides:

- ✅ **Centralized Authentication**: Single source of truth for auth state
- ✅ **Type Safety**: Full TypeScript support throughout
- ✅ **Session Persistence**: Automatic session management
- ✅ **Security**: Cookie-based sessions with proper security headers
- ✅ **Developer Experience**: Easy-to-use hooks and consistent API
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Performance**: Optimized loading states and network calls

This architecture ensures secure, maintainable, and scalable authentication across your entire Next.js application.
