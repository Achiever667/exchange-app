/**
 * Wallet Dashboard Page
 * 
 * Example of composing multiple feature modules:
 * - Auth (verify user)
 * - Wallet (display wallets)
 * - Payment (initiate deposits)
 * 
 * Demonstrates:
 * - Clean separation of concerns
 * - Feature module composition
 * - Error handling
 * - Loading states
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useWallets, useTransferFunds } from '@/features/wallet';
import { useInitiatePayment, usePaymentStatus } from '@/features/payment';
import { WalletList } from '@/features/wallet/components/WalletList';
import { PaymentInitiationForm } from '@/features/payment/components/PaymentInitiation';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/features/auth/store';

/**
 * Wallet Dashboard Page Component
 * Protected route that requires authentication
 */
export default function WalletDashboard() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const { isAuthenticated } = useAuth();
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // If not authenticated, show message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please log in to access your wallets.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Wallet List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">My Wallets</h2>
              <WalletList
                onWalletSelect={setSelectedWalletId}
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="space-y-6">
            {/* Deposit Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  disabled={!selectedWalletId}
                >
                  Deposit Funds
                </Button>
                <Button
                  fullWidth
                  variant="secondary"
                  disabled={!selectedWalletId}
                >
                  Transfer
                </Button>
                <Button
                  fullWidth
                  variant="secondary"
                  disabled={!selectedWalletId}
                >
                  Withdraw
                </Button>
              </div>
              {!selectedWalletId && (
                <p className="text-xs text-gray-500 mt-3">
                  Select a wallet to enable actions
                </p>
              )}
            </div>

            {/* Payment Form */}
            {showPaymentForm && selectedWalletId && (
              <div className="bg-white rounded-lg shadow p-6">
                <PaymentInitiationForm
                  walletId={selectedWalletId}
                  onSuccess={(paymentId) => {
                    console.log('Payment initiated:', paymentId);
                    setShowPaymentForm(false);
                  }}
                />
              </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tip</h4>
              <p className="text-sm text-blue-800">
                Select a wallet from the list to enable deposit, transfer, and withdrawal actions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
