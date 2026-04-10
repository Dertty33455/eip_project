from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.db.models import Avg

from books.models import Book
from social.models import Post, Follow
from favorites.models import Favorite
from reviews.models import Review

User = get_user_model()

class PublicProfileView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Compile stats
        books_listed = Book.objects.filter(seller=user).count()
        books_sold = Book.objects.filter(seller=user, status='SOLD').count()
        followers = Follow.objects.filter(following=user).count()
        following = Follow.objects.filter(follower=user).count()
        
        # Calculate seller's average rating (from books they sold)
        seller_reviews = Review.objects.filter(book__seller=user)
        review_count = seller_reviews.count()
        rating_avg = seller_reviews.aggregate(avg=Avg('rating'))['avg'] or 0.0
        
        # Recent posts
        recent_posts = []
        for post in Post.objects.filter(author=user).order_by('-created_at')[:10]:
            recent_posts.append({
                'id': str(post.id),
                'content': post.content,
                'imageUrl': post.images[0] if post.images else None,
                'likesCount': post.likes.count(), 
                'commentsCount': post.comments.count(),
                'createdAt': post.created_at.isoformat()
            })
            
        # Listed books
        listed_books = []
        for book in Book.objects.filter(seller=user, status='AVAILABLE').order_by('-created_at')[:10]:
            listed_books.append({
                'id': str(book.id),
                'title': book.title,
                'author': book.author,
                'price': float(book.price),
                'coverImage': book.cover_image,
                'condition': book.condition
            })
            
        # Favorite audiobooks (duration_minutes converted to seconds)
        favorite_audiobooks = []
        favs = Favorite.objects.filter(user=user, audiobook__isnull=False).select_related('audiobook')[:10]
        for fav in favs:
            if fav.audiobook:
                favorite_audiobooks.append({
                    'id': str(fav.audiobook.id),
                    'title': fav.audiobook.title,
                    'author': fav.audiobook.author,
                    'coverImage': fav.audiobook.cover_image,
                    'duration': fav.audiobook.duration_minutes * 60
                })
                
        is_seller = getattr(user, 'role', '') == 'SELLER'
        
        profile_data = {
            'id': str(user.id),
            'username': user.username,
            'firstName': getattr(user, 'first_name', ''),
            'lastName': getattr(user, 'last_name', ''),
            'bio': getattr(user, 'bio', ''),
            'avatar': getattr(user, 'avatar', ''),
            'coverImage': '', 
            'email': user.email, 
            'phone': getattr(user, 'phone', ''),
            'city': getattr(user, 'location', ''),
            'country': getattr(user, 'country', ''),
            'isVerified': getattr(user, 'isVerifiedSeller', getattr(user, 'isEmailVerified', False)),
            'isSeller': is_seller,
            'createdAt': user.date_joined.isoformat() if hasattr(user, 'date_joined') else '',
            'stats': {
                'booksListed': books_listed,
                'booksSold': books_sold,
                'followers': followers,
                'following': following,
                'rating': round(rating_avg, 1),
                'reviewCount': review_count
            },
            'badges': [],
            'recentPosts': recent_posts,
            'listedBooks': listed_books,
            'favoriteAudiobooks': favorite_audiobooks
        }
        
        return Response(profile_data)
