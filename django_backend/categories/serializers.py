from rest_framework import serializers
from .models import Category, CategoryImage

class CategoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary']

class CategorySerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    sortOrder = serializers.IntegerField(source='sort_order', read_only=True)
    isActive = serializers.BooleanField(source='is_active', read_only=True)
    isFeatured = serializers.BooleanField(source='is_featured', read_only=True)
    hasChildren = serializers.BooleanField(source='has_children', read_only=True)
    images = CategoryImageSerializer(many=True, read_only=True)
    parentId = serializers.UUIDField(source='parent.id', read_only=True)
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'type', 'parentId', 'icon', 'color',
            'isActive', 'isFeatured', 'sortOrder', 'createdAt', 'updatedAt', 'hasChildren',
            'images', 'children'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.all(), many=True).data
        return []

class CategoryCreateSerializer(serializers.ModelSerializer):
    parentId = serializers.UUIDField(source='parent', required=False, allow_null=True)
    
    class Meta:
        model = Category
        fields = [
            'name', 'description', 'type', 'parentId', 'icon', 'color',
            'is_active', 'is_featured', 'sort_order'
        ]
    
    def validate_parentId(self, value):
        if value and value == self.instance.id if self.instance else None:
            raise serializers.ValidationError("A category cannot be its own parent.")
        return value

class CategoryTreeSerializer(serializers.ModelSerializer):
    """Serializer for hierarchical category tree structure"""
    children = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'type', 'icon', 'color', 'children', 'image']
    
    def get_children(self, obj):
        if obj.children.exists():
            return CategoryTreeSerializer(obj.children.filter(is_active=True), many=True).data
        return []
    
    def get_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image_url
        return obj.images.first().image_url if obj.images.exists() else None
