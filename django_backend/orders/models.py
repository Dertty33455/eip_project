from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book
from audiobooks.models import Audiobook
import uuid

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
        ('REFUNDED', 'Refunded'),
    )
    
    DELIVERY_TYPE_CHOICES = (
        ('STANDARD', 'Standard Delivery'),
        ('EXPRESS', 'Express Delivery'),
        ('PICKUP', 'Pickup at Store'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sold_orders')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    commission = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    seller_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    delivery_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    currency = models.CharField(max_length=3, default='XOF')
    
    # Delivery information
    delivery_type = models.CharField(max_length=20, choices=DELIVERY_TYPE_CHOICES, default='STANDARD')
    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=100)
    delivery_country = models.CharField(max_length=100)
    delivery_phone = models.CharField(max_length=20)
    
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    paid_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number} - {self.buyer.username}"


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # Product information
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    audiobook = models.ForeignKey(Audiobook, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    
    product_title = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.product_title} - Order {self.order.order_number}"


class Invoice(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('ISSUED', 'Issued'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('CANCELLED', 'Cancelled'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice')
    
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices_sent')
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices_received')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    
    issued_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Invoice {self.invoice_number}"
