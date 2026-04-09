/**
 * Orders API Service
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';

export interface Order {
  id: string;
  order_number: string;
  buyer: string;
  seller?: string;
  status: string;
  payment_status: string;
  total_amount: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  shipping_address: string;
  billing_address: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  shipped_at?: string;
  delivered_at?: string;
}

export interface OrderItem {
  id: string;
  order: string;
  product_id: string;
  product_type: 'book' | 'audiobook';
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  issued_at?: string;
  paid_at?: string;
}

export const ordersService = {
  // Get all orders
  getOrders: (params?: any) =>
    apiClient.get<Order[]>(API_ENDPOINTS.ORDERS.LIST, { params }),

  // Get single order
  getOrder: (id: string) =>
    apiClient.get<Order>(`${API_ENDPOINTS.ORDERS.LIST}${id}/`),

  // Create order
  createOrder: (data: any) =>
    apiClient.post(API_ENDPOINTS.ORDERS.CREATE, data),

  // Get my orders (as buyer)
  getMyOrders: () =>
    apiClient.get<Order[]>(API_ENDPOINTS.ORDERS.LIST + 'my_orders/'),

  // Get selling orders (as seller)
  getSellingOrders: () =>
    apiClient.get<Order[]>(API_ENDPOINTS.ORDERS.LIST + 'selling/'),

  // Mark order as paid
  markPaid: (id: string) =>
    apiClient.post(`${API_ENDPOINTS.ORDERS.LIST}${id}/mark_paid/`, {}),

  // Mark order as shipped
  markShipped: (id: string, data: { tracking_number?: string }) =>
    apiClient.post(`${API_ENDPOINTS.ORDERS.LIST}${id}/mark_shipped/`, data),

  // Mark order as delivered
  markDelivered: (id: string) =>
    apiClient.post(`${API_ENDPOINTS.ORDERS.LIST}${id}/mark_delivered/`, {}),

  // Cancel order
  cancelOrder: (id: string) =>
    apiClient.post(`${API_ENDPOINTS.ORDERS.LIST}${id}/cancel/`, {}),

  // Get invoices
  getInvoices: (params?: any) =>
    apiClient.get<Invoice[]>(API_ENDPOINTS.ORDERS.INVOICES, { params }),

  // Get single invoice
  getInvoice: (id: string) =>
    apiClient.get<Invoice>(`${API_ENDPOINTS.ORDERS.INVOICES}${id}/`),

  // Mark invoice as paid
  markInvoicePaid: (id: string) =>
    apiClient.post(`${API_ENDPOINTS.ORDERS.INVOICES}${id}/mark_paid/`, {}),
};
