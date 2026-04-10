from rest_framework import serializers
from .models import Book, BookInquiry, BookRating

class BookSerializer(serializers.ModelSerializer):
    seller = serializers.StringRelatedField(read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    publishedDate = serializers.DateField(source='published_date', read_only=True)
    coverImage = serializers.URLField(source='cover_image', read_only=True)
    additionalImages = serializers.JSONField(source='additional_images', read_only=True)
    originalPrice = serializers.DecimalField(source='original_price', max_digits=10, decimal_places=2, read_only=True)
    isNegotiable = serializers.BooleanField(source='is_negotiable', read_only=True)
    sellerLocation = serializers.CharField(source='seller_location', read_only=True)
    isFeatured = serializers.BooleanField(source='is_featured', read_only=True)
    isVerified = serializers.BooleanField(source='is_verified', read_only=True)
    shippingAvailable = serializers.BooleanField(source='shipping_available', read_only=True)
    shippingCost = serializers.DecimalField(source='shipping_cost', max_digits=6, decimal_places=2, read_only=True)
    pickupAvailable = serializers.BooleanField(source='pickup_available', read_only=True)
    viewCount = serializers.IntegerField(source='view_count', read_only=True)
    favoriteCount = serializers.IntegerField(source='favorite_count', read_only=True)
    inquiryCount = serializers.IntegerField(source='inquiry_count', read_only=True)
    
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'isbn', 'publisher', 'publishedDate',
            'description', 'genre', 'language', 'condition', 'pages', 'dimensions',
            'weight', 'coverImage', 'additionalImages', 'price', 'originalPrice',
            'isNegotiable', 'seller', 'sellerLocation', 'status', 'isFeatured',
            'isVerified', 'shippingAvailable', 'shippingCost', 'pickupAvailable',
            'viewCount', 'favoriteCount', 'inquiryCount', 'createdAt', 'updatedAt'
        ]

class BookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'title', 'author', 'isbn', 'publisher', 'published_date',
            'description', 'genre', 'language', 'condition', 'pages', 'dimensions',
            'weight', 'cover_image', 'additional_images', 'price', 'original_price',
            'is_negotiable', 'seller_location', 'shipping_available',
            'shipping_cost', 'pickup_available'
        ]

class BookInquirySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    book = BookSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    respondedAt = serializers.DateTimeField(source='responded_at', read_only=True)
    
    class Meta:
        model = BookInquiry
        fields = ['id', 'user', 'book', 'message', 'seller_response', 'status', 'createdAt', 'respondedAt']
        read_only_fields = ['id', 'user', 'createdAt', 'respondedAt']

class BookInquiryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookInquiry
        fields = ['book', 'message']

class BookInquiryResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookInquiry
        fields = ['seller_response', 'status']

class BookRatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    book = BookSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = BookRating
        fields = ['id', 'user', 'book', 'rating', 'review', 'createdAt']
        read_only_fields = ['id', 'user', 'createdAt']

class BookRatingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRating
        fields = ['book', 'rating', 'review']
