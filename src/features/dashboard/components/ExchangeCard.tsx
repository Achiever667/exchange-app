"use client";

import { useState } from "react";
import { CurrencyCode } from "@/types";
import { UiField } from "@/components/ui/field";
import { UiSelect } from "@/components/ui/select/UiSelectInput";
import { UiButton } from "@/components/ui/button/UiButton";

interface ExchangeCardProps {
  onExchange?: (from: CurrencyCode, to: CurrencyCode, amount: number) => void;
}

const currencyOptions = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "GBP - British Pound", value: "GBP" },
];

export function ExchangeCard({ onExchange }: ExchangeCardProps) {
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<string>("");

  const handleExchange = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onExchange?.(fromCurrency as CurrencyCode, toCurrency as CurrencyCode, numAmount);
    }
  };

  const convertedAmount = amount ? (parseFloat(amount) * 0.92).toFixed(2) : "";

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Exchange</h3>
      
      <div className="space-y-4">
        {/* From - Amount */}
        <UiField
          label="From"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(val) => setAmount(val)}
        />

        {/* From Currency Select */}
        <UiSelect
          label="Currency"
          value={fromCurrency}
          options={currencyOptions}
          onChange={(val) => setFromCurrency(val as string)}
        />

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            type="button"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To - Amount (Read Only) */}
        <UiField
          label="To"
          type="text"
          placeholder="0.00"
          value={convertedAmount}
          disabled
        />

        {/* To Currency Select */}
        <UiSelect
          label="Currency"
          value={toCurrency}
          options={currencyOptions}
          onChange={(val) => setToCurrency(val as string)}
        />

        {/* Exchange Button */}
        <UiButton
          fullWidth
          onClick={handleExchange}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Exchange Now
        </UiButton>
      </div>
    </div>
  );
}
