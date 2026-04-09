from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.CharField(source='reviewer.username', read_only=True)
    reviewer_avatar = serializers.CharField(source='reviewer.avatar', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    audiobook_title = serializers.CharField(source='audiobook.title', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'reviewer', 'reviewer_username', 'reviewer_avatar', 'book', 'audiobook', 
                  'book_title', 'audiobook_title', 'rating', 'title', 'content', 
                  'is_verified_purchase', 'is_reported', 'helpful_count', 'unhelpful_count',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'reviewer', 'is_reported', 'helpful_count', 'unhelpful_count', 'created_at', 'updated_at']
