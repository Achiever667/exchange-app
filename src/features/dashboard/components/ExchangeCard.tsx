"use client";

import { useState } from "react";
import { CurrencyCode } from "@/types";

interface ExchangeCardProps {
  onExchange?: (from: CurrencyCode, to: CurrencyCode, amount: number) => void;
}

const currencies: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

export function ExchangeCard({ onExchange }: ExchangeCardProps) {
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("EUR");
  const [amount, setAmount] = useState<string>("");

  const handleExchange = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onExchange?.(fromCurrency, toCurrency, numAmount);
    }
  };

  const fromSymbol = currencies.find((c) => c.code === fromCurrency)?.symbol || "$";
  const toSymbol = currencies.find((c) => c.code === toCurrency)?.symbol || "€";

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Exchange</h3>
      
      <div className="space-y-4">
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const temp = fromCurrency;
              setFromCurrency(toCurrency);
              setToCurrency(temp);
            }}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={amount ? `${(parseFloat(amount) * 0.92).toFixed(2)}` : ""}
              readOnly
              placeholder="0.00"
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Button */}
        <button
          onClick={handleExchange}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Exchange Now
        </button>
      </div>
    </div>
  );
}
