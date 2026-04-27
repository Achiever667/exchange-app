/**
 * Payment API Service - Payment domain API calls
 * Handles payment initialization, status, and webhooks
 * 
 * SOLID: Single Responsibility - Only payment API calls
 */

import { apiClient } from '@/services/apiClient';
import {
  Payment,
  PaymentInitiationPayload,
  PaymentInitiationResponse,
  WebhookPayload,
} from '@/types';
import { PAYMENT_ENDPOINTS } from '@/constants';

/**
 * Payment API Service
 */
class PaymentApiService {
  /**
   * Initiate a payment
   */
  async initiatePayment(payload: PaymentInitiationPayload): Promise<PaymentInitiationResponse> {
    const response = await apiClient.post<PaymentInitiationResponse>(
      PAYMENT_ENDPOINTS.INITIATE_PAYMENT,
      payload
    );
    return response.data!;
  }

  /**
   * Check payment status
   */
  async getPaymentStatus(paymentId: string): Promise<Payment> {
    const url = PAYMENT_ENDPOINTS.GET_PAYMENT_STATUS.replace(':id', paymentId);
    const response = await apiClient.get<Payment>(url);
    return response.data!;
  }

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<{ methods: string[] }> {
    const response = await apiClient.get<{ methods: string[] }>(
      PAYMENT_ENDPOINTS.GET_PAYMENT_METHODS
    );
    return response.data!;
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(page = 1, pageSize = 20): Promise<{ payments: Payment[] }> {
    const response = await apiClient.get<{ payments: Payment[] }>(
      PAYMENT_ENDPOINTS.GET_PAYMENT_HISTORY,
      {
        params: { page, pageSize },
      }
    );
    return response.data!;
  }

  /**
   * Validate webhook signature
   */
  async validateWebhook(payload: WebhookPayload): Promise<{ valid: boolean }> {
    const response = await apiClient.post<{ valid: boolean }>(
      PAYMENT_ENDPOINTS.VALIDATE_WEBHOOK,
      payload
    );
    return response.data!;
  }
}

export const paymentApiService = new PaymentApiService();

export default paymentApiService;
