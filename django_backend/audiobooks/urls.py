from django.urls import path
from .views import (
    AudiobookListView, AudiobookDetailView, AudiobookCreateView,
    AudiobookUpdateView, AudiobookDeleteView, AudiobookProgressView,
    AudiobookPlayView, AudiobookRatingListView, AudiobookRatingCreateView,
    UserAudiobooksView, FeaturedAudiobooksView
)

urlpatterns = [
    # Audiobook CRUD
    path('', AudiobookListView.as_view(), name='audiobook-list'),
    path('create/', AudiobookCreateView.as_view(), name='audiobook-create'),
    path('featured/', FeaturedAudiobooksView.as_view(), name='featured-audiobooks'),
    path('my-audiobooks/', UserAudiobooksView.as_view(), name='user-audiobooks'),
    path('<uuid:pk>/', AudiobookDetailView.as_view(), name='audiobook-detail'),
    path('<uuid:pk>/update/', AudiobookUpdateView.as_view(), name='audiobook-update'),
    path('<uuid:pk>/delete/', AudiobookDeleteView.as_view(), name='audiobook-delete'),
    
    # Audiobook progress and playback
    path('<uuid:audiobook_id>/progress/', AudiobookProgressView.as_view(), name='audiobook-progress'),
    path('<uuid:audiobook_id>/play/', AudiobookPlayView.as_view(), name='audiobook-play'),
    
    # Audiobook ratings
    path('<uuid:audiobook_id>/ratings/', AudiobookRatingListView.as_view(), name='audiobook-ratings'),
    path('<uuid:audiobook_id>/ratings/create/', AudiobookRatingCreateView.as_view(), name='audiobook-rating-create'),
]
