"""
Payment Service
Handles payment processing, transaction management, and account operations.
"""
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from ..models import Transaction, PaymentMethod, Wallet
import logging
import uuid

logger = logging.getLogger(__name__)


class PaymentService:
    """Service for managing payments and transactions."""
    
    PAYMENT_METHODS = {
        'credit_card': 'Credit Card',
        'debit_card': 'Debit Card',
        'mobile_money': 'Mobile Money',
        'bank_transfer': 'Bank Transfer',
        'wallet': 'Wallet Transfer',
        'crypto': 'Cryptocurrency'
    }
    
    @staticmethod
    def validate_amount(amount):
        """Validate payment amount."""
        if amount <= 0:
            raise ValidationError("Amount must be greater than 0")
        
        max_amount = Decimal('999999.99')
        if amount > max_amount:
            raise ValidationError(f"Amount cannot exceed {max_amount}")
        
        return True
    
    @staticmethod
    def create_payment_method(user, method_type, details, is_default=False):
        """Create a new payment method for a user."""
        if method_type not in PaymentService.PAYMENT_METHODS:
            raise ValidationError(f"Invalid payment method: {method_type}")
        
        # If setting as default, unset other defaults
        if is_default:
            PaymentMethod.objects.filter(user=user, is_default=True).update(is_default=False)
        
        payment_method = PaymentMethod.objects.create(
            user=user,
            method_type=method_type,
            details=details,
            is_default=is_default,
            is_verified=False
        )
        
        logger.info(f"Payment method created for user {user.id}: {method_type}")
        
        return payment_method
    
    @staticmethod
    def verify_payment_method(payment_method):
        """Verify a payment method."""
        payment_method.is_verified = True
        payment_method.save()
        
        logger.info(f"Payment method {payment_method.id} verified")
        
        return payment_method
    
    @staticmethod
    def delete_payment_method(payment_method):
        """Delete a payment method."""
        if payment_method.is_default:
            # Set another as default if available
            other_methods = PaymentMethod.objects.filter(
                user=payment_method.user
            ).exclude(id=payment_method.id)
            
            if other_methods.exists():
                other_methods.first().is_default = True
                other_methods.first().save()
        
        payment_method.delete()
        
        logger.info(f"Payment method {payment_method.id} deleted")
    
    @staticmethod
    def process_payment(user, amount, description, payment_method=None):
        """Process a payment transaction."""
        PaymentService.validate_amount(amount)
        
        wallet = Wallet.objects.get(user=user)
        
        if wallet.balance < amount:
            raise ValidationError("Insufficient wallet balance")
        
        with transaction.atomic():
            # Create transaction
            txn = Transaction.objects.create(
                wallet=wallet,
                transaction_type='payment',
                amount=amount,
                description=description,
                status='completed',
                payment_method=payment_method,
                reference_id=f"PAY-{uuid.uuid4().hex[:12].upper()}"
            )
            
            # Update wallet balance
            wallet.balance -= amount
            wallet.save()
            
            logger.info(f"Payment processed: {txn.id} for user {user.id}")
        
        return txn
    
    @staticmethod
    def process_deposit(user, amount, payment_method):
        """Process a deposit transaction."""
        PaymentService.validate_amount(amount)
        
        if not payment_method:
            raise ValidationError("Payment method is required for deposits")
        
        if not payment_method.is_verified:
            raise ValidationError("Payment method must be verified before use")
        
        wallet = Wallet.objects.get(user=user)
        
        with transaction.atomic():
            # Create transaction
            txn = Transaction.objects.create(
                wallet=wallet,
                transaction_type='deposit',
                amount=amount,
                description='Account deposit',
                status='pending',
                payment_method=payment_method,
                reference_id=f"DEP-{uuid.uuid4().hex[:12].upper()}"
            )
            
            logger.info(f"Deposit initiated: {txn.id} for user {user.id}")
        
        return txn
    
    @staticmethod
    def confirm_deposit(transaction_obj):
        """Confirm a deposit transaction."""
        if transaction_obj.status != 'pending':
            raise ValidationError("Only pending transactions can be confirmed")
        
        if transaction_obj.transaction_type != 'deposit':
            raise ValidationError("Only deposit transactions can be confirmed")
        
        with transaction.atomic():
            # Update transaction
            transaction_obj.status = 'completed'
            transaction_obj.completed_at = timezone.now()
            transaction_obj.save()
            
            # Update wallet
            wallet = transaction_obj.wallet
            wallet.balance += transaction_obj.amount
            wallet.save()
            
            logger.info(f"Deposit confirmed: {transaction_obj.id}")
        
        return transaction_obj
    
    @staticmethod
    def refund_transaction(transaction_obj, reason=None):
        """Refund a completed transaction."""
        if transaction_obj.status == 'refunded':
            raise ValidationError("Transaction already refunded")
        
        if transaction_obj.status != 'completed':
            raise ValidationError("Only completed transactions can be refunded")
        
        with transaction.atomic():
            # Create refund transaction
            refund = Transaction.objects.create(
                wallet=transaction_obj.wallet,
                transaction_type='refund',
                amount=transaction_obj.amount,
                description=f"Refund for {transaction_obj.reference_id}: {reason or 'No reason provided'}",
                status='completed',
                parent_transaction=transaction_obj,
                reference_id=f"REF-{uuid.uuid4().hex[:12].upper()}"
            )
            
            # Update original transaction
            transaction_obj.status = 'refunded'
            transaction_obj.save()
            
            # Update wallet
            wallet = transaction_obj.wallet
            wallet.balance += transaction_obj.amount
            wallet.save()
            
            logger.info(f"Transaction refunded: {transaction_obj.id} -> {refund.id}")
        
        return refund
    
    @staticmethod
    def get_transaction_history(user, limit=50):
        """Get transaction history for a user."""
        wallet = Wallet.objects.get(user=user)
        return Transaction.objects.filter(wallet=wallet).order_by('-created_at')[:limit]
    
    @staticmethod
    def get_wallet_balance(user):
        """Get current wallet balance."""
        wallet = Wallet.objects.get(user=user)
        return wallet.balance
    
    @staticmethod
    def transfer_funds(from_user, to_user, amount, description=None):
        """Transfer funds between two user wallets."""
        PaymentService.validate_amount(amount)
        
        from_wallet = Wallet.objects.get(user=from_user)
        to_wallet = Wallet.objects.get(user=to_user)
        
        if from_wallet.balance < amount:
            raise ValidationError("Insufficient balance for transfer")
        
        with transaction.atomic():
            reference_id = f"TRF-{uuid.uuid4().hex[:12].upper()}"
            
            # Debit from source
            debit_txn = Transaction.objects.create(
                wallet=from_wallet,
                transaction_type='transfer_out',
                amount=amount,
                description=description or f"Transfer to {to_user.username}",
                status='completed',
                reference_id=reference_id
            )
            
            # Credit to destination
            credit_txn = Transaction.objects.create(
                wallet=to_wallet,
                transaction_type='transfer_in',
                amount=amount,
                description=description or f"Transfer from {from_user.username}",
                status='completed',
                reference_id=reference_id
            )
            
            # Update balances
            from_wallet.balance -= amount
            from_wallet.save()
            
            to_wallet.balance += amount
            to_wallet.save()
            
            logger.info(f"Transfer completed: {from_user.id} -> {to_user.id}, amount: {amount}")
        
        return {
            'debit_transaction': debit_txn,
            'credit_transaction': credit_txn,
            'reference_id': reference_id
        }
