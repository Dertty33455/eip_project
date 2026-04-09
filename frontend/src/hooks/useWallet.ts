/**
 * Wallet Hooks - React Query integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { walletService } from '@/lib/api/services/wallet';

// Query Keys
const WALLET_QUERY_KEYS = {
  all: ['wallet'] as const,
  wallet: () => [...WALLET_QUERY_KEYS.all, 'wallet'] as const,
  balance: () => [...WALLET_QUERY_KEYS.all, 'balance'] as const,
  stats: () => [...WALLET_QUERY_KEYS.all, 'stats'] as const,
  transactions: (params?: any) => [...WALLET_QUERY_KEYS.all, 'transactions', params] as const,
  paymentMethods: () => [...WALLET_QUERY_KEYS.all, 'payment-methods'] as const,
  subscriptionPricing: () => [...WALLET_QUERY_KEYS.all, 'subscription-pricing'] as const,
};

// Get wallet
export const useGetWallet = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.wallet(),
    queryFn: async () => {
      const response = await walletService.getWallet();
      return response.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

// Get balance
export const useGetBalance = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.balance(),
    queryFn: async () => {
      const response = await walletService.getBalance();
      return response.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Get stats
export const useGetWalletStats = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.stats(),
    queryFn: async () => {
      const response = await walletService.getStats();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get transactions
export const useGetTransactions = (params?: any) => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.transactions(params),
    queryFn: async () => {
      const response = await walletService.getTransactions(params);
      return response.data;
    },
  });
};

// Get payment methods
export const useGetPaymentMethods = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.paymentMethods(),
    queryFn: async () => {
      const response = await walletService.getPaymentMethods();
      return response.data;
    },
  });
};

// Create payment method
export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await walletService.createPaymentMethod(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.paymentMethods() });
    },
  });
};

// Deposit mutation
export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await walletService.deposit(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.wallet() });
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.balance() });
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.transactions() });
    },
  });
};

// Payment mutation
export const usePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await walletService.payment(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.wallet() });
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.balance() });
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.transactions() });
    },
  });
};

// Get subscription pricing
export const useGetSubscriptionPricing = () => {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.subscriptionPricing(),
    queryFn: async () => {
      const response = await walletService.getSubscriptionPricing();
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
