from rest_framework import status, views, generics, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Count
from .models import Audiobook, AudiobookProgress, AudiobookRating
from .serializers import (
    AudiobookSerializer, AudiobookCreateSerializer,
    AudiobookProgressSerializer, AudiobookRatingSerializer,
    AudiobookRatingCreateSerializer
)

class AudiobookListView(generics.ListAPIView):
    queryset = Audiobook.objects.all()
    serializer_class = AudiobookSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genre', 'language', 'is_free', 'is_premium']
    search_fields = ['title', 'author', 'narrator']
    ordering_fields = ['created_at', 'title', 'author', 'average_rating', 'price']
    ordering = ['-created_at']

class AudiobookDetailView(generics.RetrieveAPIView):
    queryset = Audiobook.objects.all()
    serializer_class = AudiobookSerializer
    permission_classes = [AllowAny]

class AudiobookCreateView(generics.CreateAPIView):
    serializer_class = AudiobookCreateSerializer
    permission_classes = [IsAuthenticated]

class AudiobookUpdateView(generics.UpdateAPIView):
    queryset = Audiobook.objects.all()
    serializer_class = AudiobookCreateSerializer
    permission_classes = [IsAuthenticated]

class AudiobookDeleteView(generics.DestroyAPIView):
    queryset = Audiobook.objects.all()
    serializer_class = AudiobookSerializer
    permission_classes = [IsAuthenticated]

class AudiobookProgressView(generics.RetrieveUpdateAPIView):
    serializer_class = AudiobookProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        audiobook_id = self.kwargs['audiobook_id']
        user = self.request.user
        progress, created = AudiobookProgress.objects.get_or_create(
            user=user, audiobook_id=audiobook_id,
            defaults={'current_position': 0, 'is_completed': False}
        )
        return progress

class AudiobookPlayView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, audiobook_id):
        try:
            audiobook = Audiobook.objects.get(id=audiobook_id)
            progress, created = AudiobookProgress.objects.get_or_create(
                user=request.user, audiobook=audiobook,
                defaults={'current_position': 0, 'is_completed': False}
            )
            
            # Increment play count
            audiobook.total_plays += 1
            audiobook.save()
            
            return Response({
                'message': 'Play recorded',
                'progress': AudiobookProgressSerializer(progress).data
            })
        except Audiobook.DoesNotExist:
            return Response({'error': 'Audiobook not found'}, status=status.HTTP_404_NOT_FOUND)

class AudiobookRatingListView(generics.ListAPIView):
    serializer_class = AudiobookRatingSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        audiobook_id = self.kwargs['audiobook_id']
        return AudiobookRating.objects.filter(audiobook_id=audiobook_id)

class AudiobookRatingCreateView(generics.CreateAPIView):
    serializer_class = AudiobookRatingCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        # Update audiobook rating statistics
        audiobook = serializer.instance.audiobook
        ratings = AudiobookRating.objects.filter(audiobook=audiobook)
        avg_rating = ratings.aggregate(avg=Avg('rating'))['avg'] or 0
        audiobook.average_rating = avg_rating
        audiobook.rating_count = ratings.count()
        audiobook.save()

class UserAudiobooksView(generics.ListAPIView):
    serializer_class = AudiobookProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AudiobookProgress.objects.filter(user=self.request.user)

class FeaturedAudiobooksView(generics.ListAPIView):
    serializer_class = AudiobookSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Audiobook.objects.all().order_by('-created_at')[:10]
