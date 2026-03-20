from rest_framework import status, views, generics, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Count, Q
from django.utils import timezone
from .models import Book, BookFavorite, BookInquiry, BookRating
from .serializers import (
    BookSerializer, BookCreateSerializer, BookFavoriteSerializer,
    BookInquirySerializer, BookInquiryCreateSerializer, BookInquiryResponseSerializer,
    BookRatingSerializer, BookRatingCreateSerializer
)

class BookListView(generics.ListAPIView):
    queryset = Book.objects.filter(status='AVAILABLE')
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genre', 'language', 'condition', 'status', 'is_featured', 'is_verified']
    search_fields = ['title', 'author', 'publisher', 'description']
    ordering_fields = ['created_at', 'title', 'author', 'price', 'view_count', 'favorite_count']
    ordering = ['-created_at']

class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class BookCreateView(generics.CreateAPIView):
    serializer_class = BookCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class BookUpdateView(generics.UpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only allow sellers to update their own books
        return Book.objects.filter(seller=self.request.user)

class BookDeleteView(generics.DestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only allow sellers to delete their own books
        return Book.objects.filter(seller=self.request.user)

class UserBooksView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Book.objects.filter(seller=self.request.user)

class BookFavoriteListView(generics.ListAPIView):
    serializer_class = BookFavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BookFavorite.objects.filter(user=self.request.user)

class BookFavoriteCreateView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id)
            favorite, created = BookFavorite.objects.get_or_create(
                user=request.user, book=book
            )
            
            if created:
                # Update favorite count
                book.favorite_count += 1
                book.save()
                return Response({'message': 'Book added to favorites'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Book already in favorites'}, status=status.HTTP_200_OK)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

class BookFavoriteRemoveView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, book_id):
        try:
            favorite = BookFavorite.objects.get(user=request.user, book_id=book_id)
            book = favorite.book
            favorite.delete()
            
            # Update favorite count
            if book.favorite_count > 0:
                book.favorite_count -= 1
                book.save()
                
            return Response({'message': 'Book removed from favorites'})
        except BookFavorite.DoesNotExist:
            return Response({'error': 'Book not in favorites'}, status=status.HTTP_404_NOT_FOUND)

class BookInquiryListView(generics.ListAPIView):
    serializer_class = BookInquirySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users can see their inquiries, sellers can see inquiries for their books
        user = self.request.user
        return BookInquiry.objects.filter(
            Q(user=user) | Q(book__seller=user)
        ).distinct()

class BookInquiryCreateView(generics.CreateAPIView):
    serializer_class = BookInquiryCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        book = serializer.validated_data['book']
        serializer.save(user=self.request.user)
        
        # Update inquiry count
        book.inquiry_count += 1
        book.save()

class BookInquiryResponseView(generics.UpdateAPIView):
    serializer_class = BookInquiryResponseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only sellers can respond to inquiries about their books
        return BookInquiry.objects.filter(book__seller=self.request.user)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(responded_at=timezone.now())
        return Response(serializer.data)

class BookRatingListView(generics.ListAPIView):
    serializer_class = BookRatingSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        book_id = self.kwargs['book_id']
        return BookRating.objects.filter(book_id=book_id)

class BookRatingCreateView(generics.CreateAPIView):
    serializer_class = BookRatingCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FeaturedBooksView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Book.objects.filter(status='AVAILABLE', is_featured=True).order_by('-created_at')[:10]
