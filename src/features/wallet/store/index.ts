/**
 * Wallet Store - Global wallet state management
 * Manages wallet list state, selected wallet, and UI state
 * 
 * SOLID: Single Responsibility - Only wallet state
 */

import { create } from 'zustand';
import { Wallet, Transaction } from '@/types';

interface WalletState {
  wallets: Wallet[];
  selectedWalletId: string | null;
  transactions: Transaction[];
  isLoadingWallets: boolean;
  isLoadingTransactions: boolean;
  error: string | null;

  // Actions
  setWallets: (wallets: Wallet[]) => void;
  setSelectedWallet: (walletId: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setLoadingWallets: (loading: boolean) => void;
  setLoadingTransactions: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addWallet: (wallet: Wallet) => void;
  updateWallet: (wallet: Wallet) => void;
  clearError: () => void;
}

/**
 * Wallet Store using Zustand
 */
export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],
  selectedWalletId: null,
  transactions: [],
  isLoadingWallets: false,
  isLoadingTransactions: false,
  error: null,

  setWallets: (wallets) => set({ wallets }),

  setSelectedWallet: (walletId) => set({ selectedWalletId: walletId }),

  setTransactions: (transactions) => set({ transactions }),

  setLoadingWallets: (loading) => set({ isLoadingWallets: loading }),

  setLoadingTransactions: (loading) => set({ isLoadingTransactions: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  addWallet: (wallet) =>
    set((state) => ({
      wallets: [...state.wallets, wallet],
    })),

  updateWallet: (updatedWallet) =>
    set((state) => ({
      wallets: state.wallets.map((wallet) =>
        wallet.id === updatedWallet.id ? updatedWallet : wallet
      ),
    })),
}));
