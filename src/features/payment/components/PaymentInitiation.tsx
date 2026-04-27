/**
 * Payment Components - UI components for payment feature
 * No API calls directly in components
 * 
 * SOLID: Single Responsibility - Each component has one responsibility
 */

'use client';

import { useState, FormEvent } from 'react';
import { useInitiatePayment, usePaymentStatus } from '../hooks/usePayment';
import { PaymentInitiationPayload, PaymentProvider } from '@/types';

/**
 * PaymentInitiationForm Component
 * Props:
 * - walletId: Current wallet ID
 * - onSuccess: Callback after successful payment initiation
 */
interface PaymentInitiationFormProps {
  walletId: string;
  onSuccess?: (paymentId: string) => void;
}

export function PaymentInitiationForm({ walletId, onSuccess }: PaymentInitiationFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    provider: 'STRIPE' as PaymentProvider,
  });
  const [error, setError] = useState<string | null>(null);

  const initiatePaymentMutation = useInitiatePayment();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const payload: PaymentInitiationPayload = {
        walletId,
        amount: parseFloat(formData.amount),
        currency: formData.currency as any,
        provider: formData.provider,
      };

      const result = await initiatePaymentMutation.mutateAsync(payload);

      // Redirect to payment provider if URL provided
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }

      onSuccess?.(result.paymentId);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
    }
  };

  const errorMessage = error || initiatePaymentMutation.error?.message;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white rounded-lg p-6 border border-gray-200 space-y-4">
      <h2 className="text-xl font-semibold">Deposit Funds</h2>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          name="amount"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          disabled={initiatePaymentMutation.isLoading}
          required
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
          Currency
        </label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          disabled={initiatePaymentMutation.isLoading}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>

      <div>
        <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <select
          id="provider"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          disabled={initiatePaymentMutation.isLoading}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
        >
          <option value="STRIPE">Credit Card (Stripe)</option>
          <option value="PAYPAL">PayPal</option>
          <option value="WISE">Wise Transfer</option>
          <option value="COINBASE">Crypto (Coinbase)</option>
        </select>
      </div>

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={initiatePaymentMutation.isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {initiatePaymentMutation.isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
}

/**
 * PaymentStatusComponent - Display payment status
 */
interface PaymentStatusComponentProps {
  paymentId: string;
}

export function PaymentStatus({ paymentId }: PaymentStatusComponentProps) {
  const { data: payment, isLoading, error } = usePaymentStatus(paymentId);

  if (isLoading) {
    return <div className="animate-pulse">Loading payment status...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">Failed to load payment status</p>
      </div>
    );
  }

  if (!payment) {
    return <div>No payment found</div>;
  }

  const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold">Payment Status</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor[payment.status]}`}>
            {payment.status}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Amount</p>
          <p className="font-semibold">{payment.amount} {payment.currency}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600">Payment ID</p>
        <p className="font-mono text-sm">{payment.id}</p>
      </div>

      <div>
        <p className="text-sm text-gray-600">Created</p>
        <p className="text-sm">{new Date(payment.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
