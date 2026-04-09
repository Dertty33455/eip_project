from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book
from audiobooks.models import Audiobook
import uuid

User = get_user_model()

class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    
    total_items = models.IntegerField(default=0)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Cart for {self.user.username}"
    
    def update_totals(self):
        """Update cart totals from items"""
        items = self.items.all()
        self.total_items = items.count()
        self.subtotal = sum(item.subtotal for item in items)
        self.save()


class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    
    # Product (either book or audiobook)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True, blank=True, related_name='cart_items')
    audiobook = models.ForeignKey(Audiobook, on_delete=models.CASCADE, null=True, blank=True, related_name='cart_items')
    
    product_title = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1, help_text="For books, max 5 per cart")
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['cart', 'book', 'audiobook']
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        """Calculate subtotal before saving"""
        self.subtotal = self.product_price * self.quantity
        super().save(*args, **kwargs)
        # Update cart totals
        self.cart.update_totals()
    
    def __str__(self):
        return f"{self.product_title} x{self.quantity}"
