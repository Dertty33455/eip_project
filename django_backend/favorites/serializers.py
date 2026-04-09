from rest_framework import serializers
from .models import Favorite
from books.serializers import BookSerializer
from audiobooks.serializers import AudiobookSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    audiobook = AudiobookSerializer(read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'user_username', 'book', 'audiobook', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
