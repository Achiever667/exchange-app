"use client";

import { useQuery } from "@tanstack/react-query";
import { Wallet, Transaction } from "@/types";

interface DashboardData {
  totalBalance: number;
  wallets: Wallet[];
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
}

const mockWallets: Wallet[] = [
  {
    id: "1",
    userId: "user-1",
    currency: "USD",
    balance: 12500.0,
    availableBalance: 12000.0,
    lockedBalance: 500.0,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "user-1",
    currency: "EUR",
    balance: 8500.0,
    availableBalance: 8000.0,
    lockedBalance: 500.0,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    userId: "user-1",
    currency: "GBP",
    balance: 5200.0,
    availableBalance: 5200.0,
    lockedBalance: 0,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    walletId: "1",
    type: "DEPOSIT",
    amount: 5000.0,
    status: "COMPLETED",
    description: "Bank deposit",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "tx-2",
    walletId: "1",
    type: "WITHDRAWAL",
    amount: 1500.0,
    status: "COMPLETED",
    description: "ATM withdrawal",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "tx-3",
    walletId: "2",
    type: "TRANSFER",
    amount: 2000.0,
    status: "COMPLETED",
    description: "Transfer to John",
    createdAt: "2024-01-13T09:20:00Z",
    updatedAt: "2024-01-13T09:20:00Z",
  },
  {
    id: "tx-4",
    walletId: "1",
    type: "DEPOSIT",
    amount: 3000.0,
    status: "COMPLETED",
    description: "Salary deposit",
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-12T14:00:00Z",
  },
  {
    id: "tx-5",
    walletId: "3",
    type: "TRANSFER",
    amount: 500.0,
    status: "PENDING",
    description: "Pending transfer",
    createdAt: "2024-01-15T16:00:00Z",
    updatedAt: "2024-01-15T16:00:00Z",
  },
];

export function useDashboardData(): DashboardData {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard", "data"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return {
        totalBalance: 26200.0,
        wallets: mockWallets,
        recentTransactions: mockTransactions,
        isLoading: false,
        error: null,
      };
    },
    staleTime: 5 * 60 * 1000, 
  });

  return {
    totalBalance: data?.totalBalance ?? 0,
    wallets: data?.wallets ?? [],
    recentTransactions: data?.recentTransactions ?? [],
    isLoading: isLoading,
    error: error ?? null,
  };
}
