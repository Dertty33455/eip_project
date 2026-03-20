from rest_framework import status, views, generics, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, CategoryImage
from .serializers import (
    CategorySerializer, CategoryCreateSerializer, CategoryTreeSerializer, CategoryImageSerializer
)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'parent']
    search_fields = ['name', 'description']
    ordering_fields = ['sort_order', 'name', 'created_at']
    ordering = ['sort_order', 'name']

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class CategoryCreateView(generics.CreateAPIView):
    serializer_class = CategoryCreateSerializer
    permission_classes = [IsAuthenticated]

class CategoryUpdateView(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryCreateSerializer
    permission_classes = [IsAuthenticated]

class CategoryDeleteView(generics.DestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def perform_destroy(self, instance):
        # Soft delete by setting is_active to False
        instance.is_active = False
        instance.save()

class CategoryTreeView(generics.ListAPIView):
    """Get hierarchical category tree structure"""
    serializer_class = CategoryTreeSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Only return root categories (no parent)
        return Category.objects.filter(is_active=True, parent=None).order_by('sort_order', 'name')

class CategoryByTypeView(generics.ListAPIView):
    """Get categories by type (BOOK, AUDIOBOOK, BOTH)"""
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        category_type = self.kwargs['category_type'].upper()
        return Category.objects.filter(
            is_active=True,
            type__in=[category_type, 'BOTH']
        ).order_by('sort_order', 'name')

class CategoryImageView(generics.ListCreateAPIView):
    serializer_class = CategoryImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return CategoryImage.objects.filter(category_id=category_id)
    
    def perform_create(self, serializer):
        category_id = self.kwargs['category_id']
        category = Category.objects.get(id=category_id)
        serializer.save(category=category)

class CategoryImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CategoryImage.objects.all()
    serializer_class = CategoryImageSerializer
    permission_classes = [IsAuthenticated]

class CategorySetPrimaryImageView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, category_id, image_id):
        try:
            category = Category.objects.get(id=category_id)
            image = CategoryImage.objects.get(id=image_id, category=category)
            
            # Remove primary flag from all images in this category
            CategoryImage.objects.filter(category=category).update(is_primary=False)
            
            # Set primary flag on selected image
            image.is_primary = True
            image.save()
            
            return Response({'message': 'Primary image set successfully'})
        except (Category.DoesNotExist, CategoryImage.DoesNotExist):
            return Response({'error': 'Category or image not found'}, status=status.HTTP_404_NOT_FOUND)

class FeaturedCategoriesView(generics.ListAPIView):
    """Get featured/featured categories"""
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Category.objects.filter(
            is_active=True,
            is_featured=True
        ).order_by('sort_order', 'name')[:10]
