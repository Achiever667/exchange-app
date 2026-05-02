"use client";

import { CurrencyCode } from "@/types";

interface TotalBalanceCardProps {
  balance: number;
  currency?: CurrencyCode;
}

export function TotalBalanceCard({ balance, currency = "USD" }: TotalBalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(balance);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-blue-100 text-sm font-medium">Total Balance</p>
          <h2 className="text-3xl font-bold mt-1">{formattedBalance}</h2>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm">
        <div>
          <p className="text-blue-100">Available</p>
          <p className="font-semibold">{formattedBalance}</p>
        </div>
        <div className="w-px h-8 bg-blue-400/30" />
        <div>
          <p className="text-blue-100">Locked</p>
          <p className="font-semibold">$0.00</p>
        </div>
      </div>
    </div>
  );
}
