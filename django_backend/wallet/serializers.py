from rest_framework import serializers
from django.contrib.auth import get_user_model
from decimal import Decimal
from .models import Wallet, Transaction, PaymentMethod, WithdrawalRequest

User = get_user_model()

class WalletSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Wallet
        fields = [
            'id', 'user', 'balance', 'currency', 'status', 'phone_number', 
            'provider', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']

class TransactionSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    completedAt = serializers.DateTimeField(source='completed_at', read_only=True)
    wallet = WalletSerializer(read_only=True)
    bookPurchase = serializers.StringRelatedField(source='book_purchase', read_only=True)
    audiobookPurchase = serializers.StringRelatedField(source='audiobook_purchase', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'wallet', 'reference', 'type', 'amount', 'description', 'status',
            'bookPurchase', 'audiobookPurchase', 'external_reference', 'payment_method',
            'createdAt', 'updatedAt', 'completedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt', 'completedAt']

class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'type', 'amount', 'description', 'book_purchase', 'audiobook_purchase',
            'external_reference', 'payment_method'
        ]

class PaymentMethodSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'user', 'type', 'provider', 'phone_number', 'card_last_four',
            'is_default', 'is_active', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']

class PaymentMethodCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = [
            'type', 'provider', 'phone_number', 'card_last_four', 
            'is_default', 'is_active'
        ]

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    processedAt = serializers.DateTimeField(source='processed_at', read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    wallet = WalletSerializer(read_only=True)
    paymentMethod = PaymentMethodSerializer(read_only=True)
    processedBy = serializers.StringRelatedField(source='processed_by', read_only=True)
    
    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'user', 'wallet', 'amount', 'paymentMethod', 'reason', 'status',
            'admin_notes', 'processedBy', 'createdAt', 'updatedAt', 'processedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt', 'processedAt', 'processedBy']

class WithdrawalRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalRequest
        fields = ['amount', 'payment_method', 'reason']

class WalletBalanceSerializer(serializers.ModelSerializer):
    """Simple serializer for balance checks"""
    class Meta:
        model = Wallet
        fields = ['balance', 'currency', 'status']

class DepositSerializer(serializers.Serializer):
    """Serializer for deposit requests"""
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('0.01'))
    payment_method = serializers.CharField(max_length=50)
    external_reference = serializers.CharField(max_length=200, required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)

class WithdrawalSerializer(serializers.Serializer):
    """Serializer for withdrawal requests"""
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('0.01'))
    payment_method_id = serializers.UUIDField()
    reason = serializers.CharField(required=False, allow_blank=True)

class PaymentSerializer(serializers.Serializer):
    """Serializer for making payments"""
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('0.01'))
    payment_method = serializers.CharField(max_length=50)
    external_reference = serializers.CharField(max_length=200, required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    book_id = serializers.UUIDField(required=False, allow_null=True)
    audiobook_id = serializers.UUIDField(required=False, allow_null=True)
