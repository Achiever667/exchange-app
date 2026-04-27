# Production-Grade Frontend Architecture - Exchange App

## Architecture Overview

This is a **production-grade, domain-driven frontend** architecture for a fintech exchange application using Next.js 16, TypeScript, React Query, Zustand, and Tailwind CSS.

The architecture strictly follows **SOLID principles** and mirrors a backend domain-driven design.

---

## 📁 Folder Structure

```
exchange-app/
├── app/                          # Next.js 16 App Router routing layer
│   ├── page.tsx                  # Root dashboard page
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles
│
├── src/
│   ├── features/                 # Domain-driven feature modules
│   │   ├── auth/                 # Auth domain
│   │   │   ├── api/              # API calls (no UI logic)
│   │   │   │   └── authApi.ts
│   │   │   ├── hooks/            # React Query hooks
│   │   │   │   └── useAuth.ts
│   │   │   ├── components/       # UI components
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── store/            # Zustand store
│   │   │   │   └── index.ts
│   │   │   ├── types.ts          # Feature-specific types
│   │   │   └── index.ts          # Barrel exports
│   │   │
│   │   ├── wallet/               # Wallet domain (same structure)
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   └── index.ts
│   │   │
│   │   └── payment/              # Payment domain (same structure)
│   │       ├── api/
│   │       ├── hooks/
│   │       ├── components/
│   │       └── index.ts
│   │
│   ├── services/                 # Shared services
│   │   └── apiClient.ts          # Centralized Axios with JWT interceptor
│   │
│   ├── components/               # Shared UI components
│   │   ├── common/               # Reusable components
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   └── layout/               # Layout components
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── hooks/                    # Shared/global hooks
│   │   └── index.ts              # useDebounce, useAsync, useLocalStorage
│   │
│   ├── store/                    # Global state (if needed)
│   │   └── index.ts
│   │
│   ├── lib/                      # Utility functions
│   │   └── utils.ts              # formatCurrency, formatDate, etc.
│   │
│   ├── types/                    # Global TypeScript types
│   │   └── index.ts              # All domain types
│   │
│   └── constants/                # Global constants
│       └── index.ts              # API endpoints, query keys, enums
│
└── package.json                  # Dependencies

```

---

## 🏗️ Architecture Principles

### 1. **Domain-Driven Design**
- Each business domain (Auth, Wallet, Payment) is a self-contained feature module
- Modules contain all related code: API calls, hooks, components, state
- Easy to scale by adding new domains following the same pattern

### 2. **SOLID Principles**

#### Single Responsibility
- **API Layer** (`authApi.ts`): Only HTTP calls, no UI logic
- **Hooks** (`useAuth.ts`): Only data fetching and React Query integration
- **Components** (`LoginForm.tsx`): Only UI rendering, no API calls
- **Store** (`store/index.ts`): Only state management

#### Open/Closed
- Easy to extend: add new features without modifying existing code
- New domains follow the established pattern
- New API endpoints added without touching UI

#### Liskov Substitution
- Components accept props that define behavior
- Services are interchangeable (can swap Axios for fetch)
- Hooks follow consistent API patterns

#### Interface Segregation
- Small, focused interfaces (`UserAuthPayload`, `TransferPayload`)
- Components only receive needed props
- Services expose only necessary methods

#### Dependency Inversion
- Components depend on hooks, not API clients
- Hooks depend on services, not HTTP libraries
- All communication through abstraction layers

### 3. **Separation of Concerns**
```
Components (UI only)
    ↓ uses
Hooks (React Query)
    ↓ calls
API Services (HTTP)
    ↓ depends on
Centralized API Client (Axios + JWT)
```

### 4. **Data Flow**
```
User Action (click button)
    ↓
Component Handler
    ↓
Call Hook (e.g., useLogin)
    ↓
React Query Mutation
    ↓
API Service Method
    ↓
Centralized API Client
    ↓
Backend API
    ↓
Success: Update Store & Cache
```

---

## 🔌 Core Services

### API Client (`src/services/apiClient.ts`)
**Centralized Axios instance with:**
- JWT token injection in request headers
- Automatic token refresh on 401
- Request/response interceptors
- Error standardization
- Request queuing during token refresh

**Features:**
- OAuth 2.0 Bearer token pattern
- Automatic token refresh with queue
- Error formatting to standardized `ApiError` type
- Retry logic at HTTP level

### State Management

#### Global Auth State (Zustand)
```typescript
useAuthStore()
  - user: User | null
  - tokens: AuthTokens | null
  - isAuthenticated: boolean
  - setUser()
  - logout()
  - hydrate() // Restore from localStorage
```

#### Feature State (Zustand per domain)
```typescript
useWalletStore()
  - wallets: Wallet[]
  - selectedWalletId: string | null
  - transactions: Transaction[]
  - setWallets()
  - setSelectedWallet()
```

#### Server State (React Query)
- Automatic caching and revalidation
- Background refetching
- Optimistic updates
- Pagination support

---

## 🚀 Usage Patterns

### 1. **Using Auth Hooks**
```typescript
'use client';

import { useLogin, useAuth, useLogout } from '@/features/auth';

export function LoginPage() {
  const loginMutation = useLogin();
  const { user, isAuthenticated } = useAuth();

  const handleLogin = async (credentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  return (
    // Component code
  );
}
```

### 2. **Using Wallet Hooks**
```typescript
'use client';

import { useWallets, useTransferFunds } from '@/features/wallet';

export function WalletPage() {
  const { data: wallets, isLoading } = useWallets();
  const transferMutation = useTransferFunds();

  return (
    // Display wallets
  );
}
```

### 3. **Creating New Features**
Follow the same pattern:
```
src/features/newFeature/
├── api/
│   └── newFeatureApi.ts        # API calls
├── hooks/
│   └── useNewFeature.ts        # React Query hooks
├── components/                  # UI components
│   └── NewFeatureComponent.tsx
├── store/
│   └── index.ts                # Feature state (optional)
└── index.ts                    # Barrel exports
```

### 4. **Adding API Endpoints**
1. Add endpoint to `src/constants/index.ts`
2. Create method in feature API service
3. Create hook in feature hooks file
4. Use hook in component

---

## 🔐 Authentication Flow

```
1. User submits login form
   ↓
2. LoginForm calls useLogin() hook
   ↓
3. useLogin() calls authApiService.login()
   ↓
4. authApiService calls apiClient.post()
   ↓
5. apiClient injects JWT token + makes request
   ↓
6. Backend returns user + tokens
   ↓
7. useLogin() updates auth store with user & tokens
   ↓
8. localStorage persists tokens
   ↓
9. useAuthStore.hydrate() restores state on next visit
```

### Token Management
- **Access Token**: Stored in localStorage
- **Refresh Token**: Stored in localStorage
- **Refresh Flow**: On 401, queue requests → refresh token → retry with new token

---

## 📊 Data Fetching Pattern

### React Query Configuration
```typescript
// In app/layout.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Keys Pattern
```typescript
QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    PROFILE: ['auth', 'profile'],
  },
  WALLET: {
    WALLETS: ['wallet', 'wallets'],
    WALLET_DETAIL: (id) => ['wallet', 'detail', id],
    TRANSACTIONS: (walletId) => ['wallet', 'transactions', walletId],
  },
  PAYMENT: {
    PAYMENT: (id) => ['payment', 'detail', id],
  },
}
```

**Benefits:**
- Prevent cache collisions
- Easy to invalidate specific queries
- Automatic refetching when dependencies change

---

## 🎨 Component Patterns

### Container vs Presentational
```typescript
// Presentational (no hooks, data via props)
function LoginForm({ onSubmit, isLoading }) {
  return <form>...</form>;
}

// Container (with hooks, data fetching)
export function LoginPage() {
  const loginMutation = useLogin();
  return <LoginForm onSubmit={handleSubmit} isLoading={loginMutation.isLoading} />;
}
```

### Shared Components
- Reusable across features
- No feature-specific logic
- Accept all customization via props
- Located in `src/components/common/`

---

## 🛡️ Error Handling

### Standardized Error Format
```typescript
interface ApiError {
  code: string;              // ERROR_CODES.UNAUTHORIZED
  message: string;           // User-friendly message
  statusCode: number;        // HTTP status
  details?: Record<string>;  // Additional context
}
```

### Error Handling in Components
```typescript
try {
  await loginMutation.mutateAsync(credentials);
} catch (error: any) {
  const message = error.message || 'Login failed';
  setError(message);
}
```

---

## 🔄 Scaling Guidelines

### Adding a New Domain
1. Create `src/features/newDomain/` folder
2. Add API service in `api/newDomainApi.ts`
3. Create hooks in `hooks/useNewDomain.ts`
4. Create components in `components/`
5. Add store if needed
6. Export from `index.ts`

### Adding a New Page
1. Create file in `app/[section]/page.tsx`
2. Import feature hooks and components
3. Ensure 'use client' directive for client state
4. Compose with shared components

### Modifying API
1. Update endpoint in `src/constants/index.ts`
2. Add/update method in feature API service
3. Add/update React Query hook
4. Update component to use new hook

---

## 🧪 Testing Strategy

### Unit Tests (API Services)
```typescript
describe('authApiService', () => {
  it('should call login endpoint', async () => {
    const response = await authApiService.login(credentials);
    expect(response.user).toBeDefined();
  });
});
```

### Hook Tests (React Query)
```typescript
describe('useLogin', () => {
  it('should update auth store on success', async () => {
    const { result } = renderHook(() => useLogin());
    await result.current.mutateAsync(credentials);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

### Component Tests (UI)
```typescript
describe('LoginForm', () => {
  it('should display error on failed login', () => {
    render(<LoginForm />);
    // Test error handling
  });
});
```

---

## 🚀 Performance Optimization

### Caching Strategies
1. **React Query Cache**: Automatic via staleTime/cacheTime
2. **localStorage**: User data, tokens
3. **browser Cache Headers**: Backend-driven via headers

### Code Splitting
- Feature modules loaded on-demand
- Components lazy-loaded per route
- Hooks tree-shakable

### Bundle Size
- Analyze with: `npm run analyze`
- Use dynamic imports for heavy components
- Treeshake unused code

---

## 📝 Best Practices

1. **Always use hooks, never call API directly in components**
   ```typescript
   // ❌ Wrong
   function MyComponent() {
     const [data, setData] = useState();
     useEffect(() => {
       axios.get('/api/data').then(setData);
     }, []);
   }

   // ✅ Correct
   function MyComponent() {
     const { data } = useWallets();
   }
   ```

2. **Centralize imports using barrel exports**
   ```typescript
   // ❌ Wrong
   import { useWallets } from '@/features/wallet/hooks/useWallet';

   // ✅ Correct
   import { useWallets } from '@/features/wallet';
   ```

3. **Use proper error handling**
   ```typescript
   if (error) {
     return <ErrorBoundary error={error} />;
   }
   ```

4. **Implement loading states**
   ```typescript
   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage error={error} />;
   return <Content data={data} />;
   ```

---

## 🔗 Environment Configuration

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
```

---

## 📚 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **HTTP Client**: Axios 1.6.5
- **State Management (Server)**: React Query 3.39.3
- **State Management (Client)**: Zustand 4.4.1
- **Styling**: Tailwind CSS 4
- **Validation**: Zod 3.22.4
- **Node**: 18+

---

## 🎯 Key Features

✅ Production-ready architecture  
✅ Type-safe with TypeScript  
✅ Automatic JWT token refresh  
✅ Global state management  
✅ Server-side caching with React Query  
✅ Standardized error handling  
✅ SOLID principles applied  
✅ Feature-based module organization  
✅ Easy to scale and maintain  
✅ Zero UI logic in API layer  

---

## 📞 Support

For questions or issues, refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind Docs](https://tailwindcss.com/docs)
