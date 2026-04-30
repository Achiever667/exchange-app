/**
 * Root Page - Dashboard demonstrating the architecture
 * Shows auth, wallet, and payment features
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useWallets } from '@/features/wallet/hooks/useWallet';
import { WalletList } from '@/features/wallet/components/WalletList';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Button } from '@/components/ui/UiButton';

/**
 * Dashboard Component - Main application page
 * Demonstrates:
 * - Auth state management
 * - Wallet feature integration
 * - Proper component composition
 */
function DashboardContent() {
  const { user, isAuthenticated } = useAuth();
  const { data: wallets, isLoading: walletsLoading } = useWallets();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Exchange App</h1>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>
            <LoginForm
              onSuccess={() => {
                console.log('Login successful');
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Exchange App</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
            </div>
            <Button variant="secondary" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-600">Email</dt>
                <dd className="text-sm font-medium text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Phone</dt>
                <dd className="text-sm font-medium text-gray-900">{user?.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">KYC Status</dt>
                <dd>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    user?.kyc === 'VERIFIED'
                      ? 'bg-green-100 text-green-800'
                      : user?.kyc === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.kyc}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Wallets</p>
                {/* <p className="text-2xl font-bold text-blue-600">{wallets?.length}</p> */}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <Button fullWidth variant="primary" size="md">
                Deposit
              </Button>
              <Button fullWidth variant="secondary" size="md">
                Withdraw
              </Button>
              <Button fullWidth variant="secondary" size="md">
                Transfer
              </Button>
            </div>
          </div>
        </div>

        {/* Wallets Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Wallets</h2>
          <WalletList isLoading={walletsLoading} />
        </div>
      </main>
    </div>
  );
}

/**
 * Root Layout Page Component
 * Initializes auth store hydration
 */
export default function Home() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <DashboardContent />;
}
