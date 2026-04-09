from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Analytics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    metric = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=15, decimal_places=2)
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', 'metric']

    def __str__(self):
        return f"{self.date} - {self.metric}: {self.value}"


class UserActivity(models.Model):
    ACTIVITY_TYPES = (
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('BOOK_VIEW', 'Book Viewed'),
        ('AUDIOBOOK_VIEW', 'Audiobook Viewed'),
        ('BOOK_PURCHASE', 'Book Purchased'),
        ('AUDIOBOOK_PURCHASE', 'Audiobook Purchased'),
        ('PRODUCT_ADDED_CART', 'Product Added to Cart'),
        ('PRODUCT_REMOVED_CART', 'Product Removed from Cart'),
        ('FAVORITE_ADD', 'Added to Favorites'),
        ('FAVORITE_REMOVE', 'Removed from Favorites'),
        ('REVIEW_CREATED', 'Review Created'),
        ('FOLLOW', 'User Followed'),
        ('UNFOLLOW', 'User Unfollowed'),
        ('POST_CREATED', 'Post Created'),
        ('COMMENT_CREATED', 'Comment Created'),
        ('LIKE_CREATED', 'Like Created'),
        ('SHARE_CREATED', 'Share Created'),
        ('MESSAGE_SENT', 'Message Sent'),
        ('PROFILE_UPDATED', 'Profile Updated'),
        ('PASSWORD_CHANGED', 'Password Changed'),
        ('SELLER_VERIFIED', 'Seller Verified'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField(blank=True)
    
    # Related object IDs
    related_user_id = models.UUIDField(null=True, blank=True, help_text="For activities involving another user")
    related_object_id = models.UUIDField(null=True, blank=True, help_text="For activities involving a specific item")
    related_object_type = models.CharField(max_length=50, blank=True, help_text="Type of related object (book, audiobook, post, etc)")
    
    # IP and user agent information
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['activity_type', '-created_at']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.get_activity_type_display()} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
