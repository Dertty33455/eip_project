from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book
from audiobooks.models import Audiobook
import uuid

User = get_user_model()

class Favorite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    
    # Product (either book or audiobook)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True, blank=True, related_name='favorites')
    audiobook = models.ForeignKey(Audiobook, on_delete=models.CASCADE, null=True, blank=True, related_name='favorites')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = [['user', 'book'], ['user', 'audiobook']]
        ordering = ['-created_at']
    
    def __str__(self):
        if self.book:
            return f"{self.user.username} favorited {self.book.title}"
        return f"{self.user.username} favorited {self.audiobook.title}"
