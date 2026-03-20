from django.urls import path
from .views import (
    WalletDetailView, WalletBalanceView, TransactionListView, TransactionDetailView,
    PaymentMethodListView, PaymentMethodCreateView, PaymentMethodDetailView,
    DepositView, WithdrawalRequestListView, WithdrawalRequestCreateView,
    PaymentView, WalletStatsView, AdminWithdrawalListView, AdminProcessWithdrawalView
)

urlpatterns = [
    # Wallet endpoints
    path('', WalletDetailView.as_view(), name='wallet-detail'),
    path('balance/', WalletBalanceView.as_view(), name='wallet-balance'),
    path('stats/', WalletStatsView.as_view(), name='wallet-stats'),
    
    # Transaction endpoints
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('transactions/<uuid:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('deposit/', DepositView.as_view(), name='wallet-deposit'),
    path('pay/', PaymentView.as_view(), name='wallet-payment'),
    
    # Payment method endpoints
    path('payment-methods/', PaymentMethodListView.as_view(), name='payment-method-list'),
    path('payment-methods/create/', PaymentMethodCreateView.as_view(), name='payment-method-create'),
    path('payment-methods/<uuid:pk>/', PaymentMethodDetailView.as_view(), name='payment-method-detail'),
    
    # Withdrawal endpoints
    path('withdrawals/', WithdrawalRequestListView.as_view(), name='withdrawal-list'),
    path('withdrawals/create/', WithdrawalRequestCreateView.as_view(), name='withdrawal-create'),
    
    # Admin endpoints
    path('admin/withdrawals/', AdminWithdrawalListView.as_view(), name='admin-withdrawal-list'),
    path('admin/withdrawals/<uuid:withdrawal_id>/process/', AdminProcessWithdrawalView.as_view(), name='admin-process-withdrawal'),
]
