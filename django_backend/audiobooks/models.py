from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Audiobook(models.Model):
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
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    narrator = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='EN')
    
    # File information
    duration_minutes = models.IntegerField()
    file_size = models.BigIntegerField(help_text="Size in bytes")
    cover_image = models.URLField(max_length=500, blank=True)
    audio_file_url = models.URLField(max_length=500)
    sample_audio_url = models.URLField(max_length=500, blank=True)
    
    # Pricing and availability
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_free = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)
    
    # Metadata
    publisher = models.CharField(max_length=255, blank=True)
    published_date = models.DateField()
    isbn = models.CharField(max_length=20, blank=True)
    
    # Statistics
    total_plays = models.IntegerField(default=0)
    total_downloads = models.IntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    rating_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.author}"


class AudioChapter(models.Model):
    """
    Represents a single chapter/segment of an audiobook.
    Allows breaking down an audiobook into multiple chapters with individual audio files.
    """
    audiobook = models.ForeignKey(Audiobook, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=255)
    chapter_number = models.IntegerField()
    duration_minutes = models.IntegerField(help_text="Duration in minutes")
    audio_url = models.URLField(max_length=500)
    is_free = models.BooleanField(default=False, help_text="Make this chapter free for all users")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['chapter_number']
        unique_together = ['audiobook', 'chapter_number']
    
    def __str__(self):
        return f"{self.audiobook.title} - Chapter {self.chapter_number}: {self.title}"
    
    def save(self, *args, **kwargs):
        """
        Override save to ensure the first chapter is always free.
        """
        if self.chapter_number <= 1:
            self.is_free = True
        super().save(*args, **kwargs)


class AudiobookProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audiobook_progress')
    audiobook = models.ForeignKey(Audiobook, on_delete=models.CASCADE, related_name='user_progress')
    chapter = models.ForeignKey(AudioChapter, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_progress', help_text="Specific chapter being played (optional)")
    current_position = models.IntegerField(default=0, help_text="Current position in seconds")
    is_completed = models.BooleanField(default=False)
    last_played_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'audiobook', 'chapter']
    
    def __str__(self):
        chapter_str = f" - {self.chapter.title}" if self.chapter else ""
        return f"{self.user.username} - {self.audiobook.title}{chapter_str}"

class AudiobookRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audiobook_ratings')
    audiobook = models.ForeignKey(Audiobook, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'audiobook']
    
    def __str__(self):
        return f"{self.user.username} - {self.audiobook.title} - {self.rating} stars"
