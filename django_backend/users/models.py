from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid
import secrets

class User(AbstractUser):
    ROLE_CHOICES = (
        ('USER', 'User'),
        ('SELLER', 'Seller'),
        ('ADMIN', 'Admin'),
    )

    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('SUSPENDED', 'Suspended'),
    )

    # Use UUID for primary key to match frontend's expected string ID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.URLField(max_length=500, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')

    isVerifiedSeller = models.BooleanField(default=False)
    isEmailVerified = models.BooleanField(default=False)
    isPhoneVerified = models.BooleanField(default=False)

    updatedAt = models.DateTimeField(auto_now=True)
    # AbstractUser already provides date_joined, which we can map to createdAt
    
    # Require email for authentication in Drf and Frontend
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

class Subscription(models.Model):
    PLAN_CHOICES = (
        ('MONTHLY', 'Mensuel'),
        ('QUARTERLY', 'Trimestriel'),
        ('YEARLY', 'Annuel'),
    )
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()

    def __str__(self):
        return f"{self.user.username} - {self.plan} ({self.status})"


class VerificationToken(models.Model):
    TYPE_CHOICES = (
        ('EMAIL', 'Email Verification'),
        ('PHONE', 'Phone Verification'),
        ('PASSWORD_RESET', 'Password Reset'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_tokens')
    token = models.CharField(max_length=256, unique=True, default=lambda: secrets.token_urlsafe(32))
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.type}"
    
    def is_valid(self):
        """Check if token is still valid"""
        if self.is_used:
            return False
        return timezone.now() < self.expires_at


class UserActivity(models.Model):
    """Track user activities and interactions."""
    
    ACTIVITY_TYPES = (
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('VIEW', 'View'),
        ('PURCHASE', 'Purchase'),
        ('REVIEW', 'Review'),
        ('COMMENT', 'Comment'),
        ('FAVORITE', 'Favorite'),
        ('SHARE', 'Share'),
        ('FOLLOW', 'Follow'),
        ('MESSAGE', 'Message'),
        ('UPLOAD', 'Upload'),
        ('DOWNLOAD', 'Download'),
        ('OTHER', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField(blank=True, null=True)
    
    # Related object references
    related_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='activity_mentions')
    related_object_id = models.CharField(max_length=100, blank=True, null=True)
    related_object_type = models.CharField(max_length=50, blank=True, null=True)
    
    # Metadata
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"
