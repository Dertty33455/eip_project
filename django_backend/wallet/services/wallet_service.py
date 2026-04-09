"""
Wallet Service
Handles wallet operations, statistics, and analytics.
"""
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Sum, Count, Q
from django.utils import timezone
from decimal import Decimal
from datetime import timedelta
from ..models import Wallet, Transaction
import logging

logger = logging.getLogger(__name__)


class WalletService:
    """Service for wallet management and operations."""
    
    @staticmethod
    def get_or_create_wallet(user):
        """Get or create a wallet for a user."""
        wallet, created = Wallet.objects.get_or_create(
            user=user,
            defaults={
                'balance': Decimal('0.00'),
                'currency': 'USD',
                'is_active': True
            }
        )
        return wallet, created
    
    @staticmethod
    def get_wallet_balance(user):
        """Get current wallet balance."""
        wallet, _ = WalletService.get_or_create_wallet(user)
        return wallet.balance
    
    @staticmethod
    def add_funds(user, amount, description=None, transaction_type='deposit'):
        """Add funds to a user's wallet."""
        if amount <= 0:
            raise ValidationError("Amount must be greater than 0")
        
        wallet, _ = WalletService.get_or_create_wallet(user)
        
        with transaction.atomic():
            wallet.balance += amount
            wallet.save()
            
            # Create transaction record
            Transaction.objects.create(
                wallet=wallet,
                transaction_type=transaction_type,
                amount=amount,
                description=description or f"{transaction_type.title()} of {amount}",
                status='completed',
                completed_at=timezone.now()
            )
            
            logger.info(f"Funds added to user {user.id}: {amount}")
        
        return wallet
    
    @staticmethod
    def deduct_funds(user, amount, description=None, transaction_type='withdrawal'):
        """Deduct funds from a user's wallet."""
        if amount <= 0:
            raise ValidationError("Amount must be greater than 0")
        
        wallet, _ = WalletService.get_or_create_wallet(user)
        
        if wallet.balance < amount:
            raise ValidationError(f"Insufficient balance. Available: {wallet.balance}")
        
        with transaction.atomic():
            wallet.balance -= amount
            wallet.save()
            
            # Create transaction record
            Transaction.objects.create(
                wallet=wallet,
                transaction_type=transaction_type,
                amount=amount,
                description=description or f"{transaction_type.title()} of {amount}",
                status='completed',
                completed_at=timezone.now()
            )
            
            logger.info(f"Funds deducted from user {user.id}: {amount}")
        
        return wallet
    
    @staticmethod
    def get_wallet_stats(user):
        """Get comprehensive wallet statistics."""
        wallet, _ = WalletService.get_or_create_wallet(user)
        transactions = Transaction.objects.filter(wallet=wallet)
        
        # Calculate totals by transaction type
        total_deposits = transactions.filter(
            transaction_type='deposit',
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        total_withdrawals = transactions.filter(
            transaction_type__in=['withdrawal', 'payment'],
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        total_transfers = transactions.filter(
            transaction_type__in=['transfer_in', 'transfer_out'],
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        total_refunds = transactions.filter(
            transaction_type='refund',
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        # Count transactions by status
        transaction_count = transactions.count()
        completed_count = transactions.filter(status='completed').count()
        pending_count = transactions.filter(status='pending').count()
        failed_count = transactions.filter(status='failed').count()
        
        # Last 30 days stats
        last_30_days = timezone.now() - timedelta(days=30)
        recent_transactions = transactions.filter(created_at__gte=last_30_days)
        monthly_deposits = recent_transactions.filter(
            transaction_type='deposit',
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        monthly_withdrawals = recent_transactions.filter(
            transaction_type__in=['withdrawal', 'payment'],
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        return {
            'wallet_id': wallet.id,
            'current_balance': wallet.balance,
            'currency': wallet.currency,
            'is_active': wallet.is_active,
            'total_deposits': total_deposits,
            'total_withdrawals': total_withdrawals,
            'total_transfers': total_transfers,
            'total_refunds': total_refunds,
            'transaction_count': transaction_count,
            'completed_transactions': completed_count,
            'pending_transactions': pending_count,
            'failed_transactions': failed_count,
            'monthly_deposits': monthly_deposits,
            'monthly_withdrawals': monthly_withdrawals,
            'created_at': wallet.created_at,
            'last_updated': wallet.updated_at
        }
    
    @staticmethod
    def get_transaction_summary(user, days=30):
        """Get transaction summary for the last N days."""
        wallet, _ = WalletService.get_or_create_wallet(user)
        
        start_date = timezone.now() - timedelta(days=days)
        transactions = Transaction.objects.filter(
            wallet=wallet,
            created_at__gte=start_date
        ).order_by('-created_at')
        
        summary = {
            'period_days': days,
            'total_transactions': transactions.count(),
            'transactions_by_type': {},
            'transactions_by_status': {},
            'daily_breakdown': {}
        }
        
        # Group by transaction type
        for txn in transactions:
            txn_type = txn.transaction_type
            if txn_type not in summary['transactions_by_type']:
                summary['transactions_by_type'][txn_type] = {
                    'count': 0,
                    'total_amount': Decimal('0.00')
                }
            summary['transactions_by_type'][txn_type]['count'] += 1
            summary['transactions_by_type'][txn_type]['total_amount'] += txn.amount
            
            # Group by status
            status = txn.status
            if status not in summary['transactions_by_status']:
                summary['transactions_by_status'][status] = {
                    'count': 0,
                    'total_amount': Decimal('0.00')
                }
            summary['transactions_by_status'][status]['count'] += 1
            summary['transactions_by_status'][status]['total_amount'] += txn.amount
            
            # Daily breakdown
            day = txn.created_at.date().isoformat()
            if day not in summary['daily_breakdown']:
                summary['daily_breakdown'][day] = {
                    'count': 0,
                    'total_amount': Decimal('0.00')
                }
            summary['daily_breakdown'][day]['count'] += 1
            summary['daily_breakdown'][day]['total_amount'] += txn.amount
        
        return summary
    
    @staticmethod
    def get_top_senders(limit=10):
        """Get top wallet holders (by balance)."""
        return Wallet.objects.filter(
            is_active=True,
            balance__gt=0
        ).order_by('-balance')[:limit]
    
    @staticmethod
    def get_most_active_users(days=30, limit=10):
        """Get most active wallet users."""
        start_date = timezone.now() - timedelta(days=days)
        
        wallets = Wallet.objects.annotate(
            transaction_count=Count(
                'transactions',
                filter=Q(transactions__created_at__gte=start_date)
            )
        ).filter(
            transaction_count__gt=0
        ).order_by('-transaction_count')[:limit]
        
        return wallets
    
    @staticmethod
    def is_wallet_active(user):
        """Check if user's wallet is active."""
        try:
            wallet = Wallet.objects.get(user=user)
            return wallet.is_active
        except Wallet.DoesNotExist:
            return False
    
    @staticmethod
    def deactivate_wallet(user, reason=None):
        """Deactivate a user's wallet."""
        wallet, _ = WalletService.get_or_create_wallet(user)
        
        if wallet.balance > 0:
            raise ValidationError("Cannot deactivate wallet with remaining balance")
        
        wallet.is_active = False
        wallet.save()
        
        logger.warning(f"Wallet deactivated for user {user.id}. Reason: {reason}")
        
        return wallet
    
    @staticmethod
    def reactivate_wallet(user):
        """Reactivate a user's wallet."""
        wallet, _ = WalletService.get_or_create_wallet(user)
        wallet.is_active = True
        wallet.save()
        
        logger.info(f"Wallet reactivated for user {user.id}")
        
        return wallet
