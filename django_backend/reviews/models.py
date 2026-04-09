from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book
from audiobooks.models import Audiobook
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    
    # Product (either book or audiobook)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    audiobook = models.ForeignKey(Audiobook, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5"
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    
    is_verified_purchase = models.BooleanField(default=False)
    is_reported = models.BooleanField(default=False)
    
    helpful_count = models.IntegerField(default=0)
    unhelpful_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['reviewer', 'book'], ['reviewer', 'audiobook']]
        ordering = ['-helpful_count', '-created_at']
    
    def __str__(self):
        if self.book:
            return f"Review of {self.book.title} by {self.reviewer.username} ({self.rating}★)"
        return f"Review of {self.audiobook.title} by {self.reviewer.username} ({self.rating}★)"
