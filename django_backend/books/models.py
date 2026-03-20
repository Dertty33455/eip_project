from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Book(models.Model):
    CONDITION_CHOICES = (
        ('NEW', 'New'),
        ('LIKE_NEW', 'Like New'),
        ('VERY_GOOD', 'Very Good'),
        ('GOOD', 'Good'),
        ('ACCEPTABLE', 'Acceptable'),
        ('POOR', 'Poor'),
    )
    
    GENRE_CHOICES = (
        ('FICTION', 'Fiction'),
        ('NON_FICTION', 'Non-Fiction'),
        ('BIOGRAPHY', 'Biography'),
        ('BUSINESS', 'Business'),
        ('SELF_HELP', 'Self-Help'),
        ('ROMANCE', 'Romance'),
        ('THRILLER', 'Thriller'),
        ('SCIFI', 'Science Fiction'),
        ('FANTASY', 'Fantasy'),
        ('HISTORY', 'History'),
        ('EDUCATION', 'Education'),
        ('CHILDREN', 'Children'),
        ('ACADEMIC', 'Academic'),
        ('RELIGIOUS', 'Religious'),
        ('COMICS', 'Comics'),
    )
    
    LANGUAGE_CHOICES = (
        ('EN', 'English'),
        ('FR', 'French'),
        ('AR', 'Arabic'),
        ('SW', 'Swahili'),
        ('HA', 'Hausa'),
        ('YO', 'Yoruba'),
        ('IG', 'Igbo'),
        ('ZH', 'Chinese'),
        ('ES', 'Spanish'),
        ('PT', 'Portuguese'),
    )
    
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('SOLD', 'Sold'),
        ('RESERVED', 'Reserved'),
        ('PENDING', 'Pending'),
        ('REMOVED', 'Removed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=20, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    published_date = models.DateField(null=True, blank=True)
    
    description = models.TextField()
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='EN')
    
    # Physical properties
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    pages = models.IntegerField(null=True, blank=True)
    dimensions = models.CharField(max_length=100, blank=True, help_text="Format: L x W x H in cm")
    weight = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Weight in grams")
    
    # Images
    cover_image = models.URLField(max_length=500, blank=True)
    additional_images = models.JSONField(default=list, blank=True, help_text="List of image URLs")
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_negotiable = models.BooleanField(default=False)
    
    # Seller information
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books_for_sale')
    seller_location = models.CharField(max_length=255, blank=True)
    
    # Availability and status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    is_featured = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Shipping and delivery
    shipping_available = models.BooleanField(default=True)
    shipping_cost = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    pickup_available = models.BooleanField(default=True)
    
    # Statistics
    view_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    inquiry_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.author}"

class BookFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'book']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

class BookInquiry(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ANSWERED', 'Answered'),
        ('CLOSED', 'Closed'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='book_inquiries')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='inquiries')
    message = models.TextField()
    seller_response = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Inquiry about {self.book.title} by {self.user.username}"

class BookRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='book_ratings')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'book']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} - {self.rating} stars"
