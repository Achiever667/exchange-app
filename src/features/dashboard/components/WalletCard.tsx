"use client";

import { Wallet, CurrencyCode } from "@/types";

interface WalletCardProps {
  wallet: Wallet;
  onSelect?: (walletId: string) => void;
  selected?: boolean;
}

const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BTC: "₿",
  ETH: "Ξ",
};

export function WalletCard({ wallet, onSelect, selected }: WalletCardProps) {
  const symbol = currencySymbols[wallet.currency] || "$";
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: wallet.currency,
  }).format(wallet.balance);

  const formattedAvailable = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: wallet.currency,
  }).format(wallet.availableBalance);

  return (
    <div
      onClick={() => onSelect?.(wallet.id)}
      className={`bg-white rounded-xl p-4 border transition-all cursor-pointer ${
        selected
          ? "border-blue-500 shadow-md"
          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">
              {wallet.currency.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{wallet.currency}</p>
            <p className="text-xs text-gray-500">Wallet</p>
          </div>
        </div>
        {selected && (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{formattedBalance}</p>
        <p className="text-xs text-gray-500 mt-1">
          Available: {formattedAvailable}
        </p>
      </div>
    </div>
  );
}
