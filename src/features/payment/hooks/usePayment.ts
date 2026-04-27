/**
 * Payment Hooks - React Query hooks for payment operations
 *
 * SOLID: Single Responsibility - Only payment data fetching
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import paymentApiService from '../api/paymentApi';
import {
  Payment,
  PaymentInitiationPayload,
  PaymentInitiationResponse,
  ApiError,
} from '@/types';
import { QUERY_KEYS } from '@/constants';

/**
 * Hook: Initiate payment
 */
export function useInitiatePayment() {
  return useMutation<PaymentInitiationResponse, ApiError, PaymentInitiationPayload>({
    mutationFn: async (payload) => paymentApiService.initiatePayment(payload),
  });
}

/**
 * Hook: Get payment status
 */
export function usePaymentStatus(paymentId: string) {
  return useQuery<Payment, ApiError>({
    queryKey: QUERY_KEYS.PAYMENT.PAYMENT_STATUS(paymentId),
    queryFn: async () => paymentApiService.getPaymentStatus(paymentId),
    enabled: !!paymentId,
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 1000, // Become stale after 1 second
  });
}

/**
 * Hook: Get payment methods
 */
export function usePaymentMethods() {
  return useQuery<{ methods: string[] }, ApiError>({
    queryKey: QUERY_KEYS.PAYMENT.PAYMENT_METHODS,
    queryFn: async () => paymentApiService.getPaymentMethods(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook: Get payment history
 */
export function usePaymentHistory(page = 1, pageSize = 20) {
  return useQuery<{ payments: Payment[] }, ApiError>({
    queryKey: QUERY_KEYS.PAYMENT.PAYMENT_HISTORY,
    queryFn: async () => paymentApiService.getPaymentHistory(page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook: Validate webhook
 */
export function useValidateWebhook() {
  return useMutation({
    mutationFn: async (payload: any) => paymentApiService.validateWebhook(payload),
  });
}
