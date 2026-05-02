"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/store";
import { useDashboardData } from "@/features/dashboard";
import { TotalBalanceCard } from "@/features/dashboard/components/TotalBalanceCard";
import { WalletCard } from "@/features/dashboard/components/WalletCard";
import { ExchangeCard } from "@/features/dashboard/components/ExchangeCard";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentTransactionsCard } from "@/features/dashboard/components/RecentTransactionsCard";
import { MarketWatchCard } from "@/features/dashboard/components/MarketWatchCard";
import { UiButton } from "@/components/ui/button/UiButton";

export default function DashboardPage() {
  const router = useRouter();
  const hydrate = useAuthStore((state) => state.hydrate);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { 
    totalBalance, 
    wallets, 
    recentTransactions, 
    isLoading 
  } = useDashboardData();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    // Simple check - if not authenticated after hydrating, redirect
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!isAuthenticated && !token) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Row 1: Total Balance + Wallet Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Total Balance - spans 1 column */}
          <div className="lg:col-span-1">
            <TotalBalanceCard balance={totalBalance} />
          </div>
          
          {/* Wallet Cards - spans 3 columns */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>
        </div>

        {/* Row 2: Exchange + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExchangeCard />
          </div>
          <div className="lg:col-span-1">
            <QuickActions onAction={(action) => console.log('Action:', action)} />
          </div>
        </div>

        {/* Row 3: Recent Transactions + Market Watch */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactionsCard transactions={recentTransactions} />
          </div>
          <div className="lg:col-span-1">
            <MarketWatchCard />
          </div>
        </div>

        {/* Utility Bills Card - Optional Row */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Utility Bills</h3>
                <p className="text-sm text-gray-500 mt-1">Pay your bills anytime, anywhere</p>
              </div>
              <UiButton variant="secondary">
                Pay Bills
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
