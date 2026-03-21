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
    FollowCheckView,
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
    path("users/<str:username>/follow/", FollowToggleView.as_view(), name="follow-toggle"),
    path("users/<str:username>/follow/check/", FollowCheckView.as_view(), name="follow-check"),
    path("users/<str:username>/followers/", FollowerListView.as_view(), name="follower-list"),
    path("users/<str:username>/following/", FollowingListView.as_view(), name="following-list"),

    # Feed
    path("feed/", UserFeedView.as_view(), name="user-feed"),
]
