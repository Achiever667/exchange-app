# Exchange App - Production Grade Frontend

A **production-ready, enterprise-grade frontend** for a fintech exchange application built with **Next.js 16, TypeScript, React Query, Zustand, and Tailwind CSS**.

This architecture strictly follows **SOLID principles** and implements **domain-driven design**, mirroring a scalable backend structure.

---

## 🎯 Features

✅ **Domain-Driven Architecture** - Organized by business domains (auth, wallet, payment)
✅ **SOLID Principles** - Strict separation of concerns and dependency inversion
✅ **Type-Safe** - 100% TypeScript with strict mode enabled
✅ **JWT Authentication** - Automatic token management with refresh flow
✅ **React Query** - Server state management with caching, deduplication, and refetching
✅ **Zustand** - Lightweight global state for client data
✅ **Production Ready** - Error handling, loading states, validation
✅ **Scalable** - Easy to add new features following established patterns

---

## 📋 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.4 | React framework with App Router |
| **TypeScript** | 5 | Type safety |
| **React** | 19.2.4 | UI framework |
| **React Query** | 3.39.3 | Server state management |
| **Zustand** | 4.4.1 | Client state management |
| **Axios** | 1.6.5 | HTTP client |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Zod** | 3.22.4 | Schema validation |

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone <repo-url>
cd exchange-app

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### 2. Configuration

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
exchange-app/
├── app/                          # Next.js 16 App Router
│   ├── page.tsx                  # Root dashboard
│   ├── dashboard/                # Dashboard pages
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css
│
├── src/
│   ├── features/                 # Domain-driven modules
│   │   ├── auth/                 # Authentication domain
│   │   ├── wallet/               # Wallet management
│   │   └── payment/              # Payment processing
│   │
│   ├── services/                 # Shared services
│   │   └── apiClient.ts          # Centralized API client
│   │
│   ├── components/               # Shared UI components
│   │   ├── common/               # Reusable components
│   │   └── layout/               # Layout components
│   │
│   ├── hooks/                    # Shared custom hooks
│   ├── store/                    # Global Zustand stores
│   ├── lib/                      # Utility functions
│   ├── types/                    # TypeScript types
│   └── constants/                # App constants
│
└── ARCHITECTURE.md               # Detailed architecture guide
```

---

## 🏗️ Architecture

### Domain-Based Organization

Each feature domain is self-contained with:

```
features/auth/
├── api/                          # API calls only
│   └── authApi.ts
├── hooks/                        # React Query hooks
│   └── useAuth.ts
├── components/                   # UI components
│   └── LoginForm.tsx
├── store/                        # Zustand store
│   └── index.ts
└── index.ts                      # Barrel exports
```

### Data Flow

```
Component → Hook (React Query) → API Service → Centralized Client → Backend
    ↓                                              ↓
  UI State                      JWT Token, Cache, Retry Logic
```

### SOLID Principles in Practice

| Principle | Implementation |
|-----------|-----------------|
| **S** - Single Responsibility | API layer only calls APIs, hooks handle React Query |
| **O** - Open/Closed | Easy to add features without modifying existing code |
| **L** - Liskov Substitution | Components accept props to vary behavior |
| **I** - Interface Segregation | Small focused interfaces per domain |
| **D** - Dependency Inversion | Components depend on hooks, not HTTP clients |

---

## 🔑 Core Concepts

### 1. Authentication & JWT

Automatic token management via centralized API client:

```typescript
// Tokens stored and managed automatically
- JWT injected in request headers
- Automatic token refresh on 401
- Request queuing during refresh
- Logout clears all tokens
```

### 2. State Management Strategy

```typescript
// React Query (Server State)
const { data: wallets } = useWallets();

// Zustand (Client State)
const { user } = useAuthStore();
```

### 3. API Pattern

```typescript
// No API calls in components!
// Always use hooks:

const { data, isLoading, error } = useWallets();
const mutation = useTransferFunds();

await mutation.mutateAsync(payload);
```

---

## 📖 Usage Examples

### Auth Example

```typescript
'use client';

import { useLogin, useAuth } from '@/features/auth';

export function LoginPage() {
  const loginMutation = useLogin();
  const { user } = useAuth();

  const handleSubmit = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // User updated in store automatically
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    // Component JSX
  );
}
```

### Wallet Example

```typescript
'use client';

import { useWallets, useTransferFunds } from '@/features/wallet';

export function TransferPage() {
  const { data: wallets } = useWallets();
  const transferMutation = useTransferFunds();

  const handleTransfer = async (payload) => {
    await transferMutation.mutateAsync(payload);
    // Cache invalidated automatically
  };

  return (
    // Component JSX
  );
}
```

---

## 🔐 Authentication Flow

```
1. User submits credentials
   ↓
2. useLogin() hook triggered
   ↓
3. API call made with JWT
   ↓
4. Tokens received and stored
   ↓
5. Auth store updated
   ↓
6. UI re-renders with user data
   ↓
7. On future requests: JWT auto-injected
   ↓
8. On 401: Auto token refresh + retry
```

---

## 🎯 Creating New Features

Follow this pattern to add new features:

### Step 1: Create Feature Folder

```bash
mkdir src/features/newFeature/{api,hooks,components,store}
```

### Step 2: Create API Service

```typescript
// src/features/newFeature/api/newFeatureApi.ts
class NewFeatureApiService {
  async getData(): Promise<Data> {
    const response = await apiClient.get<Data>(ENDPOINT);
    return response.data!;
  }
}
```

### Step 3: Create Hooks

```typescript
// src/features/newFeature/hooks/useNewFeature.ts
export function useNewFeatureData() {
  return useQuery(
    QUERY_KEYS.NEW_FEATURE,
    () => newFeatureApiService.getData()
  );
}
```

### Step 4: Create Components

```typescript
// src/features/newFeature/components/FeatureComponent.tsx
export function FeatureComponent() {
  const { data } = useNewFeatureData();
  return <div>{/* Component JSX */}</div>;
}
```

### Step 5: Export from Index

```typescript
// src/features/newFeature/index.ts
export { FeatureComponent } from './components/FeatureComponent';
export * from './hooks/useNewFeature';
export * from './api/newFeatureApi';
```

---

## 🧪 Testing

### Test API Services

```typescript
describe('authApiService', () => {
  it('should login user', async () => {
    const response = await authApiService.login(credentials);
    expect(response.user).toBeDefined();
  });
});
```

### Test Hooks

```typescript
describe('useLogin', () => {
  it('should update auth store', async () => {
    const { result } = renderHook(() => useLogin());
    await result.current.mutateAsync(credentials);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

### Test Components

```typescript
describe('LoginForm', () => {
  it('should submit form', () => {
    const { getByRole } = render(<LoginForm />);
    fireEvent.click(getByRole('button', { name: /login/i }));
    // Assert behavior
  });
});
```

---

## 🚀 Deployment

### Environment Setup

Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_APP_DOMAIN=https://app.production.com
```

### Build Optimization

```bash
# Build
npm run build

# Analyze bundle
npm run analyze

# Start production server
npm start
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] CORS headers configured on backend
- [ ] JWT token storage secure
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Environment-specific logging

---

## 📊 Performance Tips

1. **Lazy Load Routes**
   ```typescript
   const DetailPage = dynamic(() => import('./detail'), {
     loading: () => <Skeleton />,
   });
   ```

2. **Memoize Components**
   ```typescript
   export const WalletCard = memo(function WalletCard({ data }) {
     return <div>{/* Component */}</div>;
   });
   ```

3. **React Query Configuration**
   ```typescript
   staleTime: 5 * 60 * 1000,    // Cache longer
   cacheTime: 10 * 60 * 1000,   // Keep in memory longer
   ```

4. **Image Optimization**
   ```typescript
   <Image
     src={url}
     alt="description"
     width={200}
     height={200}
     priority={false}
   />
   ```

---

## 🐛 Debugging

### React Query DevTools

```typescript
import { ReactQueryDevtools } from 'react-query/devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools />
</QueryClientProvider>
```

### Browser DevTools

1. **Redux DevTools** for Zustand state
2. **Network tab** for API calls
3. **Console** for errors and logs

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Tailwind Docs](https://tailwindcss.com)

---

## 🤝 Contributing

1. Follow the established pattern for new features
2. Maintain SOLID principles
3. Write tests for new code
4. Update documentation
5. Keep components small and focused

---

## 📝 License

MIT

---

## 🆘 Support

For issues or questions:
1. Check [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Review existing feature examples
3. Check console for errors
4. Verify environment configuration

---

**Built with ❤️ for production-grade fintech applications**
