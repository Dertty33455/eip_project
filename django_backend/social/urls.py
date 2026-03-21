from django.urls import path

from .views import (
    PostListCreateView,
    PostDetailView,
    PostLikeView,
    PostCommentView,
    PostShareView,
    CommentListView,
    CommentDetailView,
    FollowToggleView,
    FollowerListView,
    FollowingListView,
    UserFeedView,
)

urlpatterns = [
    # Posts
    path("posts/", PostListCreateView.as_view(), name="post-list-create"),
    path("posts/<uuid:pk>/", PostDetailView.as_view(), name="post-detail"),
    path("posts/<uuid:pk>/like/", PostLikeView.as_view(), name="post-like"),
    path("posts/<uuid:pk>/comment/", PostCommentView.as_view(), name="post-comment"),
    path("posts/<uuid:pk>/share/", PostShareView.as_view(), name="post-share"),
    path("posts/<uuid:pk>/comments/", CommentListView.as_view(), name="post-comments"),

    # Comments
    path("comments/<uuid:pk>/", CommentDetailView.as_view(), name="comment-detail"),

    # Follows
    path("users/<uuid:pk>/follow/", FollowToggleView.as_view(), name="follow-toggle"),
    path("users/<uuid:pk>/followers/", FollowerListView.as_view(), name="follower-list"),
    path("users/<uuid:pk>/following/", FollowingListView.as_view(), name="following-list"),

    # Feed
    path("feed/", UserFeedView.as_view(), name="user-feed"),
]
