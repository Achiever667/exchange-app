
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  GET_PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile/update',
} as const;

export const WALLET_ENDPOINTS = {
  GET_WALLETS: '/wallets',
  GET_WALLET: '/wallets/:id',
  CREATE_WALLET: '/wallets',
  GET_TRANSACTIONS: '/wallets/:id/transactions',
  TRANSFER_FUNDS: '/wallets/transfer',
  INITIATE_WITHDRAWAL: '/wallets/withdrawal',
  GET_TRANSACTION_DETAILS: '/wallets/transactions/:id',
} as const;

export const PAYMENT_ENDPOINTS = {
  INITIATE_PAYMENT: '/payments/initiate',
  GET_PAYMENT_STATUS: '/payments/:id/status',
  GET_PAYMENT_METHODS: '/payments/methods',
  VALIDATE_WEBHOOK: '/payments/webhook/validate',
  GET_PAYMENT_HISTORY: '/payments/history',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  AUTH_STATE: 'auth_state',
} as const;

export const QUERY_KEYS = {
  AUTH: {
    USER: ['auth', 'user'],
    PROFILE: ['auth', 'profile'],
  },
  WALLET: {
    WALLETS: ['wallet', 'wallets'],
    WALLET_DETAIL: (id: string) => ['wallet', 'detail', id],
    TRANSACTIONS: (walletId: string) => ['wallet', 'transactions', walletId],
    TRANSACTION_DETAIL: (id: string) => ['wallet', 'transaction', id],
  },
  PAYMENT: {
    PAYMENT: (id: string) => ['payment', 'detail', id],
    PAYMENT_STATUS: (id: string) => ['payment', 'status', id],
    PAYMENT_METHODS: ['payment', 'methods'],
    PAYMENT_HISTORY: ['payment', 'history'],
  },
} as const;

export enum UserKYCStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  REVERSAL = 'REVERSAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  WISE = 'WISE',
  COINBASE = 'COINBASE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BTC = 'BTC',
  ETH = 'ETH',
}

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_OTP: 'INVALID_OTP',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',
} as const;

export const PAGINATION = {
  PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  MAX_PAGE_SIZE: 100,
} as const;

export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: 3600, // 1 hour
  REFRESH_TOKEN: 604800, // 7 days
} as const;
