/**
 * Wallet Hooks - React Query hooks for wallet operations
 * Manages async wallet operations and their state
 *
 * SOLID: Single Responsibility - Only wallet data fetching
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import walletApiService from '../api/walletApi';
import { useWalletStore } from '../store';
import {
  Wallet,
  Transaction,
  TransferPayload,
  WithdrawalPayload,
  TransferResponse,
  ApiError,
  PaginatedResponse,
} from '@/types';
import { QUERY_KEYS } from '@/constants';

/**
 * Hook: Fetch all wallets
 */
export function useWallets() {
  const setWallets = useWalletStore((state) => state.setWallets);
  const setLoadingWallets = useWalletStore((state) => state.setLoadingWallets);

  return useQuery<Wallet[], ApiError>({
    queryKey: QUERY_KEYS.WALLET.WALLETS,
    queryFn: async () => walletApiService.getWallets(),
    onSuccess: (data) => {
      setWallets(data);
      setLoadingWallets(false);
    },
    onError: () => setLoadingWallets(false),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook: Fetch single wallet
 */
export function useWallet(walletId: string) {
  return useQuery<Wallet, ApiError>({
    queryKey: QUERY_KEYS.WALLET.WALLET_DETAIL(walletId),
    queryFn: async () => walletApiService.getWallet(walletId),
    enabled: !!walletId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook: Fetch wallet transactions
 */
export function useWalletTransactions(walletId: string, page = 1, pageSize = 20) {
  const setTransactions = useWalletStore((state) => state.setTransactions);
  const setLoadingTransactions = useWalletStore((state) => state.setLoadingTransactions);

  return useQuery<PaginatedResponse<Transaction>, ApiError>({
    queryKey: QUERY_KEYS.WALLET.TRANSACTIONS(walletId),
    queryFn: async () => walletApiService.getTransactions(walletId, page, pageSize),
    enabled: !!walletId,
    onSuccess: (data) => {
      setTransactions(data.items);
      setLoadingTransactions(false);
    },
    onError: () => setLoadingTransactions(false),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook: Fetch transaction details
 */
export function useTransaction(transactionId: string) {
  return useQuery<Transaction, ApiError>({
    queryKey: QUERY_KEYS.WALLET.TRANSACTION_DETAIL(transactionId),
    queryFn: async () => walletApiService.getTransactionDetails(transactionId),
    enabled: !!transactionId,
  });
}

/**
 * Hook: Create new wallet
 */
export function useCreateWallet() {
  const addWallet = useWalletStore((state) => state.addWallet);
  const { refetch: refetchWallets } = useWallets();

  return useMutation<Wallet, ApiError, string>({
    mutationFn: async (currency) => walletApiService.createWallet(currency),
    onSuccess: (data) => {
      addWallet(data);
      refetchWallets();
    },
  });
}

/**
 * Hook: Transfer funds
 */
export function useTransferFunds() {
  const { refetch: refetchWallets } = useWallets();

  return useMutation<TransferResponse, ApiError, TransferPayload>({
    mutationFn: async (payload) => walletApiService.transferFunds(payload),
    onSuccess: () => {
      refetchWallets();
      // Optionally invalidate transactions
    },
  });
}

/**
 * Hook: Initiate withdrawal
 */
export function useWithdrawal() {
  const { refetch: refetchWallets } = useWallets();

  return useMutation<TransferResponse, ApiError, WithdrawalPayload>({
    mutationFn: async (payload) => walletApiService.initiateWithdrawal(payload),
    onSuccess: () => {
      refetchWallets();
    },
  });
}

/**
 * Hook: Get wallet store state
 */
export function useWalletState() {
  return useWalletStore((state) => ({
    wallets: state.wallets,
    selectedWalletId: state.selectedWalletId,
    transactions: state.transactions,
    isLoadingWallets: state.isLoadingWallets,
    isLoadingTransactions: state.isLoadingTransactions,
    error: state.error,
  }));
}
