from rest_framework import serializers
from .models import Audiobook, AudiobookProgress, AudiobookRating

class AudiobookSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    publishedDate = serializers.DateField(source='published_date', read_only=True)
    fileSize = serializers.IntegerField(source='file_size', read_only=True)
    coverImage = serializers.URLField(source='cover_image', read_only=True)
    audioFileUrl = serializers.URLField(source='audio_file_url', read_only=True)
    sampleAudioUrl = serializers.URLField(source='sample_audio_url', read_only=True)
    isFree = serializers.BooleanField(source='is_free', read_only=True)
    isPremium = serializers.BooleanField(source='is_premium', read_only=True)
    totalPlays = serializers.IntegerField(source='total_plays', read_only=True)
    totalDownloads = serializers.IntegerField(source='total_downloads', read_only=True)
    averageRating = serializers.DecimalField(source='average_rating', max_digits=3, decimal_places=2, read_only=True)
    ratingCount = serializers.IntegerField(source='rating_count', read_only=True)
    
    class Meta:
        model = Audiobook
        fields = [
            'id', 'title', 'author', 'narrator', 'description', 'genre', 'language',
            'duration_minutes', 'fileSize', 'coverImage', 'audioFileUrl', 'sampleAudioUrl',
            'price', 'isFree', 'isPremium', 'publisher', 'publishedDate', 'isbn',
            'totalPlays', 'totalDownloads', 'averageRating', 'ratingCount',
            'createdAt', 'updatedAt'
        ]

class AudiobookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audiobook
        fields = [
            'title', 'author', 'narrator', 'description', 'genre', 'language',
            'duration_minutes', 'file_size', 'cover_image', 'audio_file_url', 'sample_audio_url',
            'price', 'is_free', 'is_premium', 'publisher', 'published_date', 'isbn'
        ]

class AudiobookProgressSerializer(serializers.ModelSerializer):
    audiobook = AudiobookSerializer(read_only=True)
    lastPlayedAt = serializers.DateTimeField(source='last_played_at', read_only=True)
    currentPosition = serializers.IntegerField(source='current_position', read_only=True)
    isCompleted = serializers.BooleanField(source='is_completed', read_only=True)
    
    class Meta:
        model = AudiobookProgress
        fields = ['id', 'audiobook', 'currentPosition', 'isCompleted', 'lastPlayedAt']

class AudiobookRatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    audiobook = AudiobookSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = AudiobookRating
        fields = ['id', 'user', 'audiobook', 'rating', 'review', 'createdAt']
        read_only_fields = ['id', 'user', 'createdAt']

class AudiobookRatingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudiobookRating
        fields = ['audiobook', 'rating', 'review']
