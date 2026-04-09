from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Review
from .serializers import ReviewSerializer
from books.models import Book
from audiobooks.models import Audiobook


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get reviews, optionally filtered by product"""
        queryset = Review.objects.all()
        
        book_id = self.request.query_params.get('book_id')
        audiobook_id = self.request.query_params.get('audiobook_id')
        
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        if audiobook_id:
            queryset = queryset.filter(audiobook_id=audiobook_id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Get user's reviews"""
        reviews = Review.objects.filter(reviewer=request.user)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def create_book_review(self, request):
        """Create review for a book"""
        book_id = request.data.get('book_id')
        rating = request.data.get('rating')
        title = request.data.get('title')
        content = request.data.get('content')
        
        if not all([book_id, rating, title, content]):
            return Response({'error': 'All fields are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        
        review, created = Review.objects.update_or_create(
            reviewer=request.user,
            book=book,
            defaults={
                'rating': rating,
                'title': title,
                'content': content,
            }
        )
        
        serializer = self.get_serializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def create_audiobook_review(self, request):
        """Create review for an audiobook"""
        audiobook_id = request.data.get('audiobook_id')
        rating = request.data.get('rating')
        title = request.data.get('title')
        content = request.data.get('content')
        
        if not all([audiobook_id, rating, title, content]):
            return Response({'error': 'All fields are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            audiobook = Audiobook.objects.get(id=audiobook_id)
        except Audiobook.DoesNotExist:
            return Response({'error': 'Audiobook not found'}, status=status.HTTP_404_NOT_FOUND)
        
        review, created = Review.objects.update_or_create(
            reviewer=request.user,
            audiobook=audiobook,
            defaults={
                'rating': rating,
                'title': title,
                'content': content,
            }
        )
        
        serializer = self.get_serializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        """Mark review as helpful"""
        review = self.get_object()
        review.helpful_count += 1
        review.save()
        return Response({'helpful_count': review.helpful_count})
    
    @action(detail=True, methods=['post'])
    def mark_unhelpful(self, request, pk=None):
        """Mark review as unhelpful"""
        review = self.get_object()
        review.unhelpful_count += 1
        review.save()
        return Response({'unhelpful_count': review.unhelpful_count})
