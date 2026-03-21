from rest_framework import generics, status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from .models import Post, Comment, Like, Share, Follow
from .serializers import (
    PostSerializer,
    PostCreateSerializer,
    CommentSerializer,
    CommentCreateSerializer,
    ShareCreateSerializer,
    FollowSerializer,
)

User = get_user_model()


# ─── Helpers ─────────────────────────────────────────────────────────────

class IsOwnerOrReadOnly:
    """Mixin: only the author/owner may mutate."""

    def check_object_owner(self, request, obj):
        owner = getattr(obj, "author", None) or getattr(obj, "user", None)
        if request.method in ("PUT", "PATCH", "DELETE") and owner != request.user:
            return False
        return True


# ─── Post views ──────────────────────────────────────────────────────────

class PostListCreateView(generics.ListCreateAPIView):
    """GET (public): paginated list of published posts.
    POST (auth): create a new post."""

    queryset = Post.objects.filter(is_published=True).select_related("author")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PostCreateSerializer
        return PostSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, is_published=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return the full representation
        post = Post.objects.select_related("author").get(pk=serializer.instance.pk)
        return Response(
            {"post": PostSerializer(post, context={"request": request}).data},
            status=status.HTTP_201_CREATED,
        )


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET (public): single post detail.
    PUT/DELETE (auth, owner only): update or delete."""

    queryset = Post.objects.select_related("author")
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response(
                {"error": "You can only edit your own posts."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author != request.user:
            return Response(
                {"error": "You can only delete your own posts."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


# ─── Post actions ────────────────────────────────────────────────────────

class PostLikeView(views.APIView):
    """POST: toggle like on a post (like ↔ unlike)."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        existing = Like.objects.filter(user=request.user, post=post).first()

        if existing:
            existing.delete()
            return Response({
                "message": "Post unliked",
                "liked": False,
                "likes_count": post.likes.count(),
                "post_id": str(post.id),
            })

        Like.objects.create(user=request.user, post=post)
        return Response({
            "message": "Post liked",
            "liked": True,
            "likes_count": post.likes.count(),
            "post_id": str(post.id),
        })


class PostCommentView(views.APIView):
    """POST: add a comment (optionally nested) to a post."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = CommentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        parent = None
        parent_id = serializer.validated_data.get("parent_id")
        if parent_id:
            parent = get_object_or_404(Comment, pk=parent_id, post=post)

        comment = Comment.objects.create(
            post=post,
            author=request.user,
            content=serializer.validated_data["content"],
            parent=parent,
        )
        comment_data = CommentSerializer(comment, context={"request": request}).data
        return Response(
            {
                "message": "Comment created",
                "comment": comment_data,
                "comments_count": post.comments.count(),
            },
            status=status.HTTP_201_CREATED,
        )


class PostShareView(views.APIView):
    """POST: share a post (optionally specifying a platform)."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = ShareCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        share = Share.objects.create(
            user=request.user,
            post=post,
            platform=serializer.validated_data.get("platform"),
        )
        return Response(
            {
                "message": "Post shared",
                "share": {
                    "id": str(share.id),
                    "platform": share.platform,
                },
                "shares_count": post.shares.count(),
            },
            status=status.HTTP_201_CREATED,
        )


# ─── Comment views ──────────────────────────────────────────────────────

class CommentListView(generics.ListAPIView):
    """GET (public): comments for a post (top-level with nested replies)."""

    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_pk = self.kwargs["pk"]
        return (
            Comment.objects.filter(post_id=post_pk, parent__isnull=True)
            .select_related("author")
            .prefetch_related("replies__author")
        )


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE: manage a single comment (owner only for mutations)."""

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.select_related("author")

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.author != request.user:
            return Response(
                {"error": "You can only edit your own comments."},
                status=status.HTTP_403_FORBIDDEN,
            )
        comment.content = request.data.get("content", comment.content)
        comment.save()
        return Response(CommentSerializer(comment, context={"request": request}).data)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.author != request.user:
            return Response(
                {"error": "You can only delete your own comments."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


# ─── Follow views ───────────────────────────────────────────────────────

class FollowToggleView(views.APIView):
    """POST: follow or unfollow a user (toggle)."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        target_user = get_object_or_404(User, pk=pk)

        if request.user == target_user:
            return Response(
                {"error": "You cannot follow yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing = Follow.objects.filter(
            follower=request.user, following=target_user
        ).first()

        if existing:
            existing.delete()
            return Response({
                "message": "Unfollowed",
                "following": False,
                "followers_count": target_user.followers_set.count(),
            })

        Follow.objects.create(follower=request.user, following=target_user)
        return Response({
            "message": "Followed",
            "following": True,
            "followers_count": target_user.followers_set.count(),
        }, status=status.HTTP_201_CREATED)


class FollowerListView(generics.ListAPIView):
    """GET (public): list followers of a user."""

    serializer_class = FollowSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_pk = self.kwargs["pk"]
        return Follow.objects.filter(following_id=user_pk).select_related(
            "follower", "following"
        )


class FollowingListView(generics.ListAPIView):
    """GET (public): list users that a user follows."""

    serializer_class = FollowSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_pk = self.kwargs["pk"]
        return Follow.objects.filter(follower_id=user_pk).select_related(
            "follower", "following"
        )


# ─── Feed ────────────────────────────────────────────────────────────────

class UserFeedView(generics.ListAPIView):
    """GET (auth): feed of published posts from followed users."""

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        following_ids = Follow.objects.filter(
            follower=self.request.user
        ).values_list("following_id", flat=True)
        return (
            Post.objects.filter(author_id__in=following_ids, is_published=True)
            .select_related("author")
            .order_by("-created_at")
        )
