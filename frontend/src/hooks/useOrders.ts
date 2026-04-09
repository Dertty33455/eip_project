/**
 * Orders Hooks - React Query integration
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/lib/api/services/orders';

// Query Keys
const ORDERS_QUERY_KEYS = {
  all: ['orders'] as const,
  list: () => [...ORDERS_QUERY_KEYS.all, 'list'] as const,
  myOrders: () => [...ORDERS_QUERY_KEYS.all, 'my-orders'] as const,
  selling: () => [...ORDERS_QUERY_KEYS.all, 'selling'] as const,
  detail: (id: string) => [...ORDERS_QUERY_KEYS.all, 'detail', id] as const,
  invoices: () => [...ORDERS_QUERY_KEYS.all, 'invoices'] as const,
};

// Get my orders (as buyer)
export const useGetMyOrders = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.myOrders(),
    queryFn: async () => {
      const response = await ordersService.getMyOrders();
      return response.data;
    },
  });
};

// Get selling orders (as seller)
export const useGetSellingOrders = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.selling(),
    queryFn: async () => {
      const response = await ordersService.getSellingOrders();
      return response.data;
    },
  });
};

// Get single order
export const useGetOrder = (id: string | null) => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.detail(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required');
      const response = await ordersService.getOrder(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await ordersService.createOrder(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.myOrders() });
    },
  });
};

// Mark order as paid
export const useMarkOrderPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await ordersService.markPaid(orderId);
      return response.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.myOrders() });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.selling() });
    },
  });
};

// Mark order as shipped
export const useMarkOrderShipped = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, trackingNumber }: { orderId: string; trackingNumber?: string }) => {
      const response = await ordersService.markShipped(orderId, {
        tracking_number: trackingNumber,
      });
      return response.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.selling() });
    },
  });
};

// Mark order as delivered
export const useMarkOrderDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await ordersService.markDelivered(orderId);
      return response.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.myOrders() });
    },
  });
};

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await ordersService.cancelOrder(orderId);
      return response.data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.myOrders() });
    },
  });
};

// Get invoices
export const useGetInvoices = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.invoices(),
    queryFn: async () => {
      const response = await ordersService.getInvoices();
      return response.data;
    },
  });
};
