/**
 * Example Implementation: Complete User Authentication & Wallet Flow
 * This demonstrates how to use all the API services and hooks together
 */

'use client';

import { useEffect, useState } from 'react';
import { useGetUser, useLogin, useLogout, useUpdateProfile } from '@/hooks/useAuth';
import { useGetBalance, useDeposit, usePayment } from '@/hooks/useWallet';
import { useGetMyOrders, useCreateOrder } from '@/hooks/useOrders';
import { useGetCart, useAddToCart } from '@/hooks/useCart';
import { useGetConversations, useSendMessage } from '@/hooks/useMessaging';

/**
 * 1. DASHBOARD - Show User Info & Wallet Balance
 */
export function DashboardComponent() {
  const { data: user, isLoading, error } = useGetUser();
  const { data: balance } = useGetBalance();

  if (isLoading) return <div className="p-4">Loading user data...</div>;

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800">
        Error loading user: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!user) {
    return <div className="p-4">No user data available. Please login first.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600">Email</p>
          <p className="text-xl font-semibold">{user.email}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <p className="text-gray-600">Wallet Balance</p>
          <p className="text-xl font-semibold">${balance?.balance || '0.00'}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Account Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Email Verified:</strong> {user.isEmailVerified ? '✓' : '✗'}</p>
          <p><strong>Phone Verified:</strong> {user.isPhoneVerified ? '✓' : '✗'}</p>
          {user.isVerifiedSeller && <p className="text-green-600"><strong>✓ Verified Seller</strong></p>}
        </div>
      </div>
    </div>
  );
}

/**
 * 2. LOGIN FORM - Authenticate User
 */
export function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      // User will be redirected or dashboard will update automatically
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>

      {loginMutation.error && (
        <div className="text-red-600 text-sm">
          {loginMutation.error instanceof Error 
            ? loginMutation.error.message 
            : 'Login failed'}
        </div>
      )}
    </form>
  );
}

/**
 * 3. WALLET OPERATIONS - Deposit & Payment
 */
export function WalletOperationsComponent() {
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const { data: balance } = useGetBalance();
  const depositMutation = useDeposit();
  const paymentMutation = usePayment();

  const handleDeposit = async () => {
    try {
      await depositMutation.mutateAsync({
        amount: parseFloat(depositAmount),
        payment_method_id: 'default-method', // Should be real method ID
      });
      setDepositAmount('');
      alert('Deposit successful!');
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };

  const handlePayment = async () => {
    try {
      await paymentMutation.mutateAsync({
        amount: parseFloat(paymentAmount),
        description: 'Payment from wallet',
      });
      setPaymentAmount('');
      alert('Payment successful!');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      <div className="bg-green-50 p-4 rounded">
        <p className="text-gray-600">Current Balance</p>
        <p className="text-3xl font-bold text-green-600">${balance?.balance || '0.00'}</p>
      </div>

      {/* Deposit Section */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3">Make a Deposit</h3>
        <div className="space-y-3">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border rounded px-3 py-2"
            step="0.01"
            min="0"
          />
          <button
            onClick={handleDeposit}
            disabled={depositMutation.isPending || !depositAmount}
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {depositMutation.isPending ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </div>

      {/* Payment Section */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3">Pay from Wallet</h3>
        <div className="space-y-3">
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border rounded px-3 py-2"
            step="0.01"
            min="0"
            max={balance?.balance}
          />
          <button
            onClick={handlePayment}
            disabled={paymentMutation.isPending || !paymentAmount}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {paymentMutation.isPending ? 'Processing...' : 'Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 4. ORDERS LIST - Show User's Orders
 */
export function OrdersListComponent() {
  const { data: orders, isLoading } = useGetMyOrders();

  if (isLoading) return <div>Loading orders...</div>;

  if (!orders || orders.length === 0) {
    return <div className="text-gray-600">No orders yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="border rounded p-4 hover:shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{order.order_number}</h3>
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Created: {new Date(order.created_at).toLocaleDateString()}
          </p>
          <p className="text-lg font-bold text-green-600 mt-2">
            ${order.total_amount.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * 5. MESSAGING - Send Messages
 */
export function MessagingComponent() {
  const [conversationId, setConversationId] = useState('');
  const [message, setMessage] = useState('');
  const { data: conversations } = useGetConversations();
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async () => {
    if (!conversationId || !message.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        data: { content: message },
      });
      setMessage('');
      alert('Message sent!');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">Select Conversation</label>
        <select
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Choose a conversation...</option>
          {conversations?.map((conv) => (
            <option key={conv.id} value={conv.id}>
              {conv.id} - {conv.last_message?.substring(0, 30)}...
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <button
        onClick={handleSendMessage}
        disabled={sendMessageMutation.isPending || !conversationId || !message.trim()}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
      </button>
    </div>
  );
}

/**
 * COMPLETE APP - Combines all components
 */
export default function CompleteApp() {
  const { data: user } = useGetUser();
  const logoutMutation = useLogout();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">BookShell</h1>
          {user && (
            <button
              onClick={() => logoutMutation.mutate()}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Login to BookShell</h2>
            <LoginComponent />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <DashboardComponent />
            </div>
            
            <div className="space-y-8">
              <WalletOperationsComponent />
              <MessagingComponent />
            </div>

            <div className="col-span-full">
              <OrdersListComponent />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
