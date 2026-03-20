from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

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
