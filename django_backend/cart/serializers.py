from rest_framework import serializers
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    audiobook_title = serializers.CharField(source='audiobook.title', read_only=True)
    book_cover = serializers.CharField(source='book.cover_image', read_only=True)
    audiobook_cover = serializers.CharField(source='audiobook.cover_image', read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'book', 'audiobook', 'product_title', 'product_price', 'quantity', 
                  'subtotal', 'book_title', 'audiobook_title', 'book_cover', 'audiobook_cover', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'subtotal', 'created_at', 'updated_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'user_email', 'total_items', 'subtotal', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total_items', 'subtotal', 'created_at', 'updated_at']
