"""
Subscription Service
Handles subscription management, pricing, and lifecycle operations.
"""
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from ..models import SubscriptionPricing, SubscriptionAudit, Wallet
from users.models import User, Subscription
import logging

logger = logging.getLogger(__name__)


class SubscriptionService:
    """Service for managing user subscriptions."""
    
    @staticmethod
    def get_or_create_subscription(user):
        """Get or create a subscription for a user."""
        subscription, created = Subscription.objects.get_or_create(
            user=user,
            defaults={
                'tier': 'free',
                'status': 'active',
                'started_at': timezone.now(),
                'expires_at': timezone.now() + timedelta(days=365)
            }
        )
        return subscription, created
    
    @staticmethod
    def upgrade_subscription(user, new_tier):
        """Upgrade a user's subscription tier."""
        if new_tier not in dict(Subscription.TIER_CHOICES):
            raise ValidationError(f"Invalid subscription tier: {new_tier}")
        
        subscription, _ = SubscriptionService.get_or_create_subscription(user)
        
        with transaction.atomic():
            # Record audit log
            SubscriptionAudit.objects.create(
                subscription=subscription,
                action='upgrade',
                old_value=subscription.tier,
                new_value=new_tier,
                metadata={
                    'upgraded_at': timezone.now().isoformat(),
                    'user_id': str(user.id)
                }
            )
            
            # Update subscription
            subscription.tier = new_tier
            subscription.status = 'active'
            subscription.expires_at = timezone.now() + timedelta(days=365)
            subscription.save()
            
            logger.info(f"User {user.id} upgraded to {new_tier} tier")
        
        return subscription
    
    @staticmethod
    def downgrade_subscription(user, new_tier):
        """Downgrade a user's subscription tier."""
        if new_tier not in dict(Subscription.TIER_CHOICES):
            raise ValidationError(f"Invalid subscription tier: {new_tier}")
        
        subscription, _ = SubscriptionService.get_or_create_subscription(user)
        
        with transaction.atomic():
            # Record audit log
            SubscriptionAudit.objects.create(
                subscription=subscription,
                action='downgrade',
                old_value=subscription.tier,
                new_value=new_tier,
                metadata={
                    'downgraded_at': timezone.now().isoformat(),
                    'user_id': str(user.id)
                }
            )
            
            # Update subscription
            subscription.tier = new_tier
            subscription.status = 'active'
            subscription.expires_at = timezone.now() + timedelta(days=365)
            subscription.save()
            
            logger.info(f"User {user.id} downgraded to {new_tier} tier")
        
        return subscription
    
    @staticmethod
    def cancel_subscription(user, reason=None):
        """Cancel a user's subscription."""
        subscription, _ = SubscriptionService.get_or_create_subscription(user)
        
        with transaction.atomic():
            # Record audit log
            SubscriptionAudit.objects.create(
                subscription=subscription,
                action='cancel',
                old_value=subscription.status,
                new_value='cancelled',
                metadata={
                    'cancelled_at': timezone.now().isoformat(),
                    'reason': reason or 'User initiated',
                    'user_id': str(user.id)
                }
            )
            
            # Update subscription
            subscription.status = 'cancelled'
            subscription.save()
            
            logger.info(f"Subscription cancelled for user {user.id}")
        
        return subscription
    
    @staticmethod
    def renew_subscription(user):
        """Renew a user's subscription."""
        subscription, _ = SubscriptionService.get_or_create_subscription(user)
        
        with transaction.atomic():
            # Record audit log
            SubscriptionAudit.objects.create(
                subscription=subscription,
                action='renew',
                old_value=subscription.status,
                new_value='active',
                metadata={
                    'renewed_at': timezone.now().isoformat(),
                    'user_id': str(user.id)
                }
            )
            
            # Update subscription
            subscription.status = 'active'
            subscription.expires_at = timezone.now() + timedelta(days=365)
            subscription.save()
            
            logger.info(f"Subscription renewed for user {user.id}")
        
        return subscription
    
    @staticmethod
    def get_subscription_pricing(tier):
        """Get pricing information for a given tier."""
        try:
            return SubscriptionPricing.objects.get(tier=tier, is_active=True)
        except SubscriptionPricing.DoesNotExist:
            raise ValidationError(f"Pricing not found for tier: {tier}")
    
    @staticmethod
    def get_all_pricing():
        """Get all active subscription pricing."""
        return SubscriptionPricing.objects.filter(is_active=True).order_by('order')
    
    @staticmethod
    def update_pricing(tier, **kwargs):
        """Update subscription pricing for a tier."""
        pricing = SubscriptionService.get_subscription_pricing(tier)
        
        # Update allowed fields
        allowed_fields = ['price', 'currency', 'description', 'features', 'billing_cycle']
        for field, value in kwargs.items():
            if field in allowed_fields:
                setattr(pricing, field, value)
        
        pricing.save()
        
        logger.info(f"Pricing updated for tier {tier}")
        
        return pricing
    
    @staticmethod
    def check_expired_subscriptions():
        """Check and handle expired subscriptions."""
        expired = Subscription.objects.filter(
            expires_at__lt=timezone.now(),
            status='active'
        )
        
        updated_count = 0
        for subscription in expired:
            subscription.status = 'expired'
            subscription.save()
            
            SubscriptionAudit.objects.create(
                subscription=subscription,
                action='expire',
                old_value='active',
                new_value='expired',
                metadata={
                    'expired_at': timezone.now().isoformat(),
                    'was_due': subscription.expires_at.isoformat()
                }
            )
            
            updated_count += 1
        
        logger.info(f"Marked {updated_count} subscriptions as expired")
        
        return updated_count
    
    @staticmethod
    def get_user_subscription_info(user):
        """Get comprehensive subscription information for a user."""
        subscription, _ = SubscriptionService.get_or_create_subscription(user)
        wallet = Wallet.objects.get(user=user)
        
        return {
            'subscription': subscription,
            'pricing': SubscriptionService.get_subscription_pricing(subscription.tier),
            'wallet': wallet,
            'is_expired': subscription.expires_at < timezone.now(),
            'days_until_expiry': (subscription.expires_at - timezone.now()).days,
            'audit_history': SubscriptionAudit.objects.filter(
                subscription=subscription
            ).order_by('-created_at')[:10]
        }
