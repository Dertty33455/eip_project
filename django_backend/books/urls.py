from django.urls import path
from .views import (
    BookListView, BookDetailView, BookCreateView, BookUpdateView, BookDeleteView,
    UserBooksView,
    BookInquiryListView, BookInquiryCreateView, BookInquiryResponseView,
    BookRatingListView, BookRatingCreateView, FeaturedBooksView
)

urlpatterns = [
    # Book CRUD
    path('', BookListView.as_view(), name='book-list'),
    path('create/', BookCreateView.as_view(), name='book-create'),
    path('featured/', FeaturedBooksView.as_view(), name='featured-books'),
    path('my-books/', UserBooksView.as_view(), name='user-books'),
    path('<uuid:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('<uuid:pk>/update/', BookUpdateView.as_view(), name='book-update'),
    path('<uuid:pk>/delete/', BookDeleteView.as_view(), name='book-delete'),
    
    # Book inquiries
    path('inquiries/', BookInquiryListView.as_view(), name='book-inquiries'),
    path('inquiries/create/', BookInquiryCreateView.as_view(), name='book-inquiry-create'),
    path('inquiries/<uuid:pk>/respond/', BookInquiryResponseView.as_view(), name='book-inquiry-respond'),
    
    # Book ratings
    path('<uuid:book_id>/ratings/', BookRatingListView.as_view(), name='book-ratings'),
    path('<uuid:book_id>/ratings/create/', BookRatingCreateView.as_view(), name='book-rating-create'),
]
