
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  kyc: KYCStatus;
  createdAt: string;
  updatedAt: string;
}

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  username: string;
  phone_number: string;
  dial_code: string;
  country: string;
  password_confirmation: string;
}

export interface OTPVerificationPayload {
  email: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface OTPResponse {
  message: string;
  expiresIn: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH';

export interface Wallet {
  id: string;
  userId: string;
  currency: CurrencyCode;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'REVERSAL';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description: string;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferPayload {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  note?: string;
}

export interface WithdrawalPayload {
  walletId: string;
  amount: number;
  bankAccountId?: string;
  cryptoAddress?: string;
}

export interface TransferResponse {
  transactionId: string;
  status: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
}

export type PaymentProvider = 'STRIPE' | 'PAYPAL' | 'WISE' | 'COINBASE';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Payment {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  currency: CurrencyCode;
  provider: PaymentProvider;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitiationPayload {
  walletId: string;
  amount: number;
  currency: CurrencyCode;
  provider: PaymentProvider;
  metadata?: Record<string, any>;
}

export interface PaymentInitiationResponse {
  paymentId: string;
  provider: PaymentProvider;
  redirectUrl?: string;
  sessionId?: string;
  status: PaymentStatus;
}

export interface WebhookPayload {
  event: string;
  data: Record<string, any>;
  timestamp: number;
  signature: string;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

export interface RequestConfig {
  retries?: number;
  timeout?: number;
  headers?: Record<string, string>;
}
