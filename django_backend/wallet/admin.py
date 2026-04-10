from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum
from .models import (
    Wallet, Transaction, PaymentMethod, WithdrawalRequest,
    SubscriptionPricing, SubscriptionAudit
)
from users.models import Subscription


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    """Admin for Wallet model."""
    list_display = ('id', 'user', 'balance_display', 'currency', 'status', 'created_at')
    list_filter = ('status', 'currency', 'created_at')
    search_fields = ('user__username', 'user__email', 'id')
    readonly_fields = ('id', 'created_at', 'updated_at', 'transaction_stats')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'id')
        }),
        ('Balance Information', {
            'fields': ('balance', 'currency')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Statistics', {
            'fields': ('transaction_stats',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def balance_display(self, obj):
        """Display balance with color coding."""
        if obj.balance > 0:
            color = 'green'
        elif obj.balance == 0:
            color = 'gray'
        else:
            color = 'red'
        return format_html(
            '<span style="color: {};">${:.2f}</span>',
            color, obj.balance
        )
    balance_display.short_description = 'Balance'
    
    def transaction_stats(self, obj):
        """Display transaction statistics."""
        transactions = obj.transactions.all()
        total = transactions.count()
        completed = transactions.filter(status='completed').count()
        pending = transactions.filter(status='pending').count()
        
        return format_html(
            '<div><p><strong>Total:</strong> {}</p>'
            '<p><strong>Completed:</strong> {}</p>'
            '<p><strong>Pending:</strong> {}</p></div>',
            total, completed, pending
        )
    transaction_stats.short_description = 'Transaction Statistics'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin for Transaction model."""
    list_display = ('reference', 'wallet_user', 'type', 'amount', 'status_badge', 'created_at')
    list_filter = ('type', 'status', 'created_at')
    search_fields = ('reference', 'wallet__user__username', 'wallet__user__email')
    readonly_fields = ('id', 'created_at', 'completed_at')
    
    fieldsets = (
        ('Transaction Details', {
            'fields': ('id', 'reference_id', 'wallet', 'transaction_type')
        }),
        ('Amount & Status', {
            'fields': ('amount', 'status')
        }),
        ('Description', {
            'fields': ('description',)
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'parent_transaction'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def wallet_user(self, obj):
        """Display wallet user."""
        return obj.wallet.user.username
    wallet_user.short_description = 'User'
    
    def status_badge(self, obj):
        """Display status as colored badge."""
        colors = {
            'completed': 'green',
            'pending': 'orange',
            'failed': 'red',
            'refunded': 'blue'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """Admin for PaymentMethod model."""
    list_display = ('user', 'type', 'provider', 'is_default', 'created_at')
    list_filter = ('type', 'provider', 'is_default', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('User', {
            'fields': ('user', 'id')
        }),
        ('Payment Method Details', {
            'fields': ('method_type', 'details')
        }),
        ('Verification & Status', {
            'fields': ('is_verified', 'is_default')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    """Admin for WithdrawalRequest model."""
    list_display = ('id', 'user', 'amount', 'status_badge', 'created_at', 'processed_at')
    list_filter = ('status', 'created_at', 'processed_at')
    search_fields = ('user__username', 'user__email', 'id')
    readonly_fields = ('id', 'created_at', 'processed_at')
    
    fieldsets = (
        ('User & Amount', {
            'fields': ('user', 'amount', 'id')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Details', {
            'fields': ('bank_details', 'notes')
        }),
        ('Processing', {
            'fields': ('processed_by', 'processed_at'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        """Display status as colored badge."""
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'completed': 'blue',
            'rejected': 'red'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'



@admin.register(SubscriptionPricing)
class SubscriptionPricingAdmin(admin.ModelAdmin):
    """Admin for SubscriptionPricing model."""
    list_display = ('plan', 'price', 'currency', 'duration_days', 'is_active')
    list_filter = ('plan', 'is_active')
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Pricing Details', {
            'fields': ('id', 'tier', 'price', 'currency')
        }),
        ('Information', {
            'fields': ('description', 'features')
        }),
        ('Configuration', {
            'fields': ('billing_cycle', 'order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SubscriptionAudit)
class SubscriptionAuditAdmin(admin.ModelAdmin):
    """Admin for SubscriptionAudit model."""
    list_display = ('subscription_user', 'action', 'old_value', 'new_value', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('subscription__user__username', 'subscription__user__email')
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Subscription', {
            'fields': ('subscription', 'id')
        }),
        ('Change Details', {
            'fields': ('action', 'old_value', 'new_value')
        }),
        ('Metadata', {
            'fields': ('metadata',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def subscription_user(self, obj):
        """Display subscription user."""
        return obj.subscription.user.username
    subscription_user.short_description = 'User'

