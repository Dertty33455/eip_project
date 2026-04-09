from rest_framework import status, views, generics, filters, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.db.models import Q, Sum
from django.utils import timezone
from .models import Wallet, Transaction, PaymentMethod, WithdrawalRequest, SubscriptionPricing
from .serializers import (
    WalletSerializer, TransactionSerializer, TransactionCreateSerializer,
    PaymentMethodSerializer, PaymentMethodCreateSerializer,
    WithdrawalRequestSerializer, WithdrawalRequestCreateSerializer,
    WalletBalanceSerializer, DepositSerializer, WithdrawalSerializer, PaymentSerializer,
    SubscriptionPricingSerializer
)

class WalletDetailView(generics.RetrieveAPIView):
    """Get user's wallet details"""
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return wallet

class WalletBalanceView(views.APIView):
    """Get user's wallet balance only"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletBalanceSerializer(wallet)
        return Response(serializer.data)

class TransactionListView(generics.ListAPIView):
    """Get user's transaction history"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['reference', 'description', 'external_reference']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return Transaction.objects.filter(wallet=wallet)

class TransactionDetailView(generics.RetrieveAPIView):
    """Get specific transaction details"""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return Transaction.objects.filter(wallet=wallet)

class PaymentMethodListView(generics.ListAPIView):
    """Get user's payment methods"""
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user, is_active=True)

class PaymentMethodCreateView(generics.CreateAPIView):
    """Add new payment method"""
    serializer_class = PaymentMethodCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # If this is set as default, unset other defaults
        if serializer.validated_data.get('is_default', False):
            PaymentMethod.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save(user=self.request.user)

class PaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Update/delete payment method"""
    serializer_class = PaymentMethodCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        # If this is set as default, unset other defaults
        if serializer.validated_data.get('is_default', False):
            PaymentMethod.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save()

class DepositView(views.APIView):
    """Handle deposits to wallet"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = DepositSerializer(data=request.data)
        if serializer.is_valid():
            wallet, created = Wallet.objects.get_or_create(user=request.user)
            
            # Create transaction
            transaction = Transaction.objects.create(
                wallet=wallet,
                type='DEPOSIT',
                amount=serializer.validated_data['amount'],
                description=serializer.validated_data.get('description', 'Deposit'),
                external_reference=serializer.validated_data.get('external_reference'),
                payment_method=serializer.validated_data['payment_method'],
                status='COMPLETED',
                completed_at=timezone.now()
            )
            
            # Update wallet balance
            wallet.balance += serializer.validated_data['amount']
            wallet.save()
            
            return Response({
                'message': 'Deposit successful',
                'transaction': TransactionSerializer(transaction).data,
                'new_balance': wallet.balance
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WithdrawalRequestListView(generics.ListAPIView):
    """Get user's withdrawal requests"""
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return WithdrawalRequest.objects.filter(wallet=wallet)

class WithdrawalRequestCreateView(views.APIView):
    """Create withdrawal request"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = WithdrawalRequestCreateSerializer(data=request.data)
        if serializer.is_valid():
            wallet, created = Wallet.objects.get_or_create(user=request.user)
            
            # Check if user has sufficient balance
            amount = serializer.validated_data['amount']
            if wallet.balance < amount:
                return Response({
                    'error': 'Insufficient balance',
                    'available_balance': wallet.balance
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check withdrawal limits (example: minimum withdrawal)
            if amount < 100:  # Minimum 100 XOF
                return Response({
                    'error': 'Minimum withdrawal amount is 100 XOF'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                payment_method = PaymentMethod.objects.get(
                    id=serializer.validated_data['payment_method_id'],
                    user=request.user,
                    is_active=True
                )
            except PaymentMethod.DoesNotExist:
                return Response({
                    'error': 'Invalid payment method'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                # Create withdrawal request
                withdrawal = WithdrawalRequest.objects.create(
                    user=request.user,
                    wallet=wallet,
                    amount=amount,
                    payment_method=payment_method,
                    reason=serializer.validated_data.get('reason', ''),
                    status='PENDING'
                )
                
                # Create pending transaction
                transaction = Transaction.objects.create(
                    wallet=wallet,
                    type='WITHDRAWAL',
                    amount=amount,
                    description=f'Withdrawal request: {withdrawal.id}',
                    status='PENDING'
                )
                
                return Response({
                    'message': 'Withdrawal request submitted',
                    'withdrawal': WithdrawalRequestSerializer(withdrawal).data,
                    'transaction': TransactionSerializer(transaction).data
                }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentView(views.APIView):
    """Handle payments for books/audiobooks"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            wallet, created = Wallet.objects.get_or_create(user=request.user)
            amount = serializer.validated_data['amount']
            
            # Check if user has sufficient balance
            if wallet.balance < amount:
                return Response({
                    'error': 'Insufficient balance',
                    'available_balance': wallet.balance
                }, status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                # Create payment transaction
                transaction = Transaction.objects.create(
                    wallet=wallet,
                    type='PAYMENT',
                    amount=amount,
                    description=serializer.validated_data.get('description', 'Purchase'),
                    external_reference=serializer.validated_data.get('external_reference'),
                    payment_method=serializer.validated_data['payment_method'],
                    status='COMPLETED',
                    completed_at=timezone.now()
                )
                
                # Link to book/audiobook if provided
                book_id = serializer.validated_data.get('book_id')
                audiobook_id = serializer.validated_data.get('audiobook_id')
                
                if book_id:
                    from books.models import Book
                    try:
                        book = Book.objects.get(id=book_id)
                        transaction.book_purchase = book
                        transaction.save()
                    except Book.DoesNotExist:
                        pass
                
                if audiobook_id:
                    from audiobooks.models import Audiobook
                    try:
                        audiobook = Audiobook.objects.get(id=audiobook_id)
                        transaction.audiobook_purchase = audiobook
                        transaction.save()
                    except Audiobook.DoesNotExist:
                        pass
                
                # Update wallet balance
                wallet.balance -= amount
                wallet.save()
                
                # Apply 5% commission for sellers
                if request.user.role == 'SELLER':
                    commission = amount * 0.05
                    Transaction.objects.create(
                        wallet=wallet,
                        type='COMMISSION',
                        amount=commission,
                        description='Commission on sale',
                        status='COMPLETED',
                        completed_at=timezone.now()
                    )
                
                return Response({
                    'message': 'Payment successful',
                    'transaction': TransactionSerializer(transaction).data,
                    'new_balance': wallet.balance
                }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WalletStatsView(views.APIView):
    """Get wallet statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        transactions = Transaction.objects.filter(wallet=wallet)
        
        # Calculate stats
        total_deposits = transactions.filter(type='DEPOSIT', status='COMPLETED').aggregate(
            total=models.Sum('amount'))['total'] or 0
        total_withdrawals = transactions.filter(type='WITHDRAWAL', status='COMPLETED').aggregate(
            total=models.Sum('amount'))['total'] or 0
        total_payments = transactions.filter(type='PAYMENT', status='COMPLETED').aggregate(
            total=models.Sum('amount'))['total'] or 0
        
        pending_withdrawals = WithdrawalRequest.objects.filter(
            wallet=wallet, status='PENDING'
        ).aggregate(total=models.Sum('amount'))['total'] or 0
        
        return Response({
            'balance': wallet.balance,
            'currency': wallet.currency,
            'total_deposits': total_deposits,
            'total_withdrawals': total_withdrawals,
            'total_payments': total_payments,
            'pending_withdrawals': pending_withdrawals,
            'transaction_count': transactions.count()
        })

class AdminWithdrawalListView(generics.ListAPIView):
    """Admin view of all withdrawal requests"""
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return WithdrawalRequest.objects.all()
        return WithdrawalRequest.objects.none()

class AdminProcessWithdrawalView(views.APIView):
    """Admin processing of withdrawal requests"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, withdrawal_id):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            withdrawal = WithdrawalRequest.objects.get(id=withdrawal_id)
            action = request.data.get('action')  # 'approve' or 'reject'
            notes = request.data.get('notes', '')
            
            if action == 'approve':
                with transaction.atomic():
                    # Update withdrawal request
                    withdrawal.status = 'COMPLETED'
                    withdrawal.processed_by = request.user
                    withdrawal.admin_notes = notes
                    withdrawal.processed_at = timezone.now()
                    withdrawal.save()
                    
                    # Update transaction
                    transaction = Transaction.objects.get(
                        wallet=withdrawal.wallet,
                        description=f'Withdrawal request: {withdrawal.id}'
                    )
                    transaction.status = 'COMPLETED'
                    transaction.completed_at = timezone.now()
                    transaction.save()
                    
                    # Deduct from wallet
                    withdrawal.wallet.balance -= withdrawal.amount
                    withdrawal.wallet.save()
                
                return Response({'message': 'Withdrawal approved'})
                
            elif action == 'reject':
                withdrawal.status = 'REJECTED'
                withdrawal.processed_by = request.user
                withdrawal.admin_notes = notes
                withdrawal.processed_at = timezone.now()
                withdrawal.save()
                
                # Update transaction
                transaction = Transaction.objects.get(
                    wallet=withdrawal.wallet,
                    description=f'Withdrawal request: {withdrawal.id}'
                )
                transaction.status = 'CANCELLED'
                transaction.save()
                
                return Response({'message': 'Withdrawal rejected'})
            
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
                
        except WithdrawalRequest.DoesNotExist:
            return Response({'error': 'Withdrawal request not found'}, status=status.HTTP_404_NOT_FOUND)


class SubscriptionPricingViewSet(viewsets.ReadOnlyModelViewSet):
    """View subscription pricing tiers"""
    queryset = SubscriptionPricing.objects.filter(is_active=True)
    serializer_class = SubscriptionPricingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['duration_days', 'price']
    ordering = ['duration_days']
