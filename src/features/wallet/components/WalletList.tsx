/**
 * Wallet Components - UI components for wallet feature
 * No API calls directly in components
 * 
 * SOLID: Single Responsibility - Each component has one responsibility
 */

'use client';

import { useWallets, useWalletState } from '../hooks/useWallet';
import { Wallet as WalletType } from '@/types';

/**
 * WalletListComponent - Display list of wallets
 * Props:
 * - onWalletSelect: Callback when wallet is selected
 * - isLoading: Optional controlled loading state
 */
interface WalletListProps {
  onWalletSelect?: (walletId: string) => void;
  isLoading?: boolean;
}

export function WalletList({ onWalletSelect, isLoading: externalLoading }: WalletListProps) {
  const query = useWallets();
  const state = useWalletState();

  const isLoading = externalLoading ?? query.isLoading ?? state.isLoadingWallets;
  const wallets = state.wallets.length > 0 ? state.wallets : query.data || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (query.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Failed to load wallets: {query.error.message}
        </p>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="rounded-md bg-gray-50 p-4 text-center">
        <p className="text-sm text-gray-600">No wallets found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wallets.map((wallet) => (
        <WalletCard
          key={wallet.id}
          wallet={wallet}
          onSelect={() => onWalletSelect?.(wallet.id)}
        />
      ))}
    </div>
  );
}

/**
 * WalletCard Component - Single wallet card
 */
interface WalletCardProps {
  wallet: WalletType;
  onSelect?: () => void;
}

export function WalletCard({ wallet, onSelect }: WalletCardProps) {
  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  return (
    <button
      onClick={onSelect}
      className="w-full bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow text-left"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{wallet.currency}</h3>
          <p className="text-sm text-gray-600">Wallet ID: {wallet.id.substring(0, 8)}...</p>
        </div>
        <span className="text-lg font-bold text-blue-600">
          {formatBalance(wallet.balance)} {wallet.currency}
        </span>
      </div>
      <div className="mt-3 flex justify-between text-xs text-gray-600">
        <span>Available: {formatBalance(wallet.availableBalance)}</span>
        <span>Locked: {formatBalance(wallet.lockedBalance)}</span>
      </div>
    </button>
  );
}

/**
 * TransferForm Component - Form for transferring funds
 */
interface TransferFormProps {
  fromWalletId: string;
  onSuccess?: () => void;
}

export function TransferForm({ fromWalletId, onSuccess }: TransferFormProps) {
  const [toWalletId, setToWalletId] = useWallets();
  const [amount, setAmount] = useWallets();
  const [note, setNote] = useWallets();

  return (
    <form className="space-y-4 bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold">Transfer Funds</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">To Wallet ID</label>
        <input
          type="text"
          value={toWalletId}
          onChange={(e) => setToWalletId(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          placeholder="Enter recipient wallet ID"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          step="0.00000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          placeholder="Add a note..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Transfer
      </button>
    </form>
  );
}
