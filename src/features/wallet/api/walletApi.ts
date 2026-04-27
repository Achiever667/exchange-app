/**
 * Wallet API Service - Wallet domain API calls
 * Handles all wallet-related operations (balances, transfers, transactions)
 * 
 * SOLID: Single Responsibility - Only wallet API calls
 */

import { apiClient } from '@/services/apiClient';
import {
  Wallet,
  Transaction,
  TransferPayload,
  WithdrawalPayload,
  TransferResponse,
  PaginatedResponse,
} from '@/types';
import { WALLET_ENDPOINTS } from '@/constants';

/**
 * Wallet API Service
 */
class WalletApiService {
  /**
   * Fetch all wallets for authenticated user
   */
  async getWallets(): Promise<Wallet[]> {
    const response = await apiClient.get<Wallet[]>(WALLET_ENDPOINTS.GET_WALLETS);
    return response.data!;
  }

  /**
   * Fetch single wallet details
   */
  async getWallet(id: string): Promise<Wallet> {
    const url = WALLET_ENDPOINTS.GET_WALLET.replace(':id', id);
    const response = await apiClient.get<Wallet>(url);
    return response.data!;
  }

  /**
   * Create new wallet
   */
  async createWallet(currency: string): Promise<Wallet> {
    const response = await apiClient.post<Wallet>(WALLET_ENDPOINTS.CREATE_WALLET, {
      currency,
    });
    return response.data!;
  }

  /**
   * Fetch transactions for a wallet
   */
  async getTransactions(
    walletId: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Transaction>> {
    const url = WALLET_ENDPOINTS.GET_TRANSACTIONS.replace(':id', walletId);
    const response = await apiClient.get<PaginatedResponse<Transaction>>(url, {
      params: { page, pageSize },
    });
    return response.data!;
  }

  /**
   * Fetch transaction details
   */
  async getTransactionDetails(id: string): Promise<Transaction> {
    const url = WALLET_ENDPOINTS.GET_TRANSACTION_DETAILS.replace(':id', id);
    const response = await apiClient.get<Transaction>(url);
    return response.data!;
  }

  /**
   * Transfer funds between wallets
   */
  async transferFunds(payload: TransferPayload): Promise<TransferResponse> {
    const response = await apiClient.post<TransferResponse>(
      WALLET_ENDPOINTS.TRANSFER_FUNDS,
      payload
    );
    return response.data!;
  }

  /**
   * Initiate withdrawal
   */
  async initiateWithdrawal(payload: WithdrawalPayload): Promise<TransferResponse> {
    const response = await apiClient.post<TransferResponse>(
      WALLET_ENDPOINTS.INITIATE_WITHDRAWAL,
      payload
    );
    return response.data!;
  }
}

export const walletApiService = new WalletApiService();

export default walletApiService;
