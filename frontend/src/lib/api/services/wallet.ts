/**
 * Wallet API Service
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

export interface Wallet {
  id: string;
  user: string;
  balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  reference_id: string;
  transaction_type: string;
  amount: number;
  status: string;
  description?: string;
  created_at: string;
  completed_at?: string;
}

export interface PaymentMethod {
  id: string;
  user: string;
  method_type: string;
  details: any;
  is_verified: boolean;
  is_default: boolean;
  created_at: string;
}

export interface SubscriptionPricing {
  id: string;
  tier: string;
  price: number;
  currency: string;
  description?: string;
  features: string[];
  billing_cycle: string;
  is_active: boolean;
}

export const walletService = {
  // Get wallet details
  getWallet: () =>
    apiClient.get<Wallet>(API_ENDPOINTS.WALLET.DETAIL),

  // Get wallet balance
  getBalance: () =>
    apiClient.get<{ balance: number }>(API_ENDPOINTS.WALLET.BALANCE),

  // Get wallet stats
  getStats: () =>
    apiClient.get(API_ENDPOINTS.WALLET.STATS),

  // Get transaction history
  getTransactions: (params?: any) =>
    apiClient.get<Transaction[]>(API_ENDPOINTS.WALLET.TRANSACTIONS, { params }),

  // Get single transaction
  getTransaction: (id: string) =>
    apiClient.get<Transaction>(`${API_ENDPOINTS.WALLET.TRANSACTIONS}${id}/`),

  // Get payment methods
  getPaymentMethods: () =>
    apiClient.get<PaymentMethod[]>(API_ENDPOINTS.WALLET.PAYMENT_METHODS),

  // Create payment method
  createPaymentMethod: (data: any) =>
    apiClient.post(API_ENDPOINTS.WALLET.PAYMENT_METHODS + 'create/', data),

  // Get single payment method
  getPaymentMethod: (id: string) =>
    apiClient.get<PaymentMethod>(`${API_ENDPOINTS.WALLET.PAYMENT_METHODS}${id}/`),

  // Delete payment method
  deletePaymentMethod: (id: string) =>
    apiClient.delete(`${API_ENDPOINTS.WALLET.PAYMENT_METHODS}${id}/`),

  // Process deposit
  deposit: (data: { amount: number; payment_method_id: string }) =>
    apiClient.post(API_ENDPOINTS.WALLET.DEPOSIT, data),

  // Process payment
  payment: (data: { amount: number; description: string; payment_method_id?: string }) =>
    apiClient.post(API_ENDPOINTS.WALLET.PAYMENT, data),

  // Request withdrawal
  requestWithdrawal: (data: { amount: number; bank_details: any }) =>
    apiClient.post(API_ENDPOINTS.WALLET.WITHDRAWALS + 'create/', data),

  // Get withdrawal requests
  getWithdrawals: (params?: any) =>
    apiClient.get(API_ENDPOINTS.WALLET.WITHDRAWALS, { params }),

  // Get subscription pricing
  getSubscriptionPricing: () =>
    apiClient.get<SubscriptionPricing[]>(API_ENDPOINTS.WALLET.SUBSCRIPTION_PRICING),
};
