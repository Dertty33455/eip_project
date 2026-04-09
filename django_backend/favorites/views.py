from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Favorite
from .serializers import FavoriteSerializer
from books.models import Book
from audiobooks.models import Audiobook


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own favorites"""
        return Favorite.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_favorites(self, request):
        """Get all user's favorites"""
        favorites = Favorite.objects.filter(user=request.user)
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_book(self, request):
        """Add book to favorites"""
        book_id = request.data.get('book_id')
        
        if not book_id:
            return Response({'error': 'book_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            book = Book.objects.get(id=book_id)
            favorite, created = Favorite.objects.get_or_create(
                user=request.user,
                book=book
            )
            serializer = self.get_serializer(favorite)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def add_audiobook(self, request):
        """Add audiobook to favorites"""
        audiobook_id = request.data.get('audiobook_id')
        
        if not audiobook_id:
            return Response({'error': 'audiobook_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            audiobook = Audiobook.objects.get(id=audiobook_id)
            favorite, created = Favorite.objects.get_or_create(
                user=request.user,
                audiobook=audiobook
            )
            serializer = self.get_serializer(favorite)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Audiobook.DoesNotExist:
            return Response({'error': 'Audiobook not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def remove(self, request):
        """Remove from favorites"""
        book_id = request.data.get('book_id')
        audiobook_id = request.data.get('audiobook_id')
        
        if book_id:
            try:
                favorite = Favorite.objects.get(user=request.user, book_id=book_id)
                favorite.delete()
                return Response({'status': 'removed from favorites'})
            except Favorite.DoesNotExist:
                return Response({'error': 'Not in favorites'}, status=status.HTTP_404_NOT_FOUND)
        
        if audiobook_id:
            try:
                favorite = Favorite.objects.get(user=request.user, audiobook_id=audiobook_id)
                favorite.delete()
                return Response({'status': 'removed from favorites'})
            except Favorite.DoesNotExist:
                return Response({'error': 'Not in favorites'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'error': 'book_id or audiobook_id is required'}, 
                      status=status.HTTP_400_BAD_REQUEST)
