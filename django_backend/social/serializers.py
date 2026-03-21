from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Post, Comment, Like, Share, Follow

User = get_user_model()


# ─── Lightweight user serializer for embedding ───────────────────────────

class UserPublicSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source="first_name", read_only=True)
    lastName = serializers.CharField(source="last_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "firstName", "lastName", "avatar"]
        read_only_fields = fields


# ─── Comment serializers ─────────────────────────────────────────────────

class CommentSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    likesCount = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id", "post", "author", "content", "parent",
            "is_reported", "replies", "likesCount", "createdAt", "updatedAt",
        ]
        read_only_fields = ["id", "post", "author", "is_reported", "createdAt", "updatedAt"]

    def get_replies(self, obj):
        # Only fetch top-level replies (one level deep to avoid N+1)
        if obj.parent is not None:
            return []
        replies = obj.replies.select_related("author").all()
        return CommentSerializer(replies, many=True, context=self.context).data

    def get_likesCount(self, obj):
        return obj.likes.count()


class CommentCreateSerializer(serializers.ModelSerializer):
    parent_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Comment
        fields = ["content", "parent_id"]

    def validate_parent_id(self, value):
        if value is not None:
            try:
                Comment.objects.get(pk=value)
            except Comment.DoesNotExist:
                raise serializers.ValidationError("Parent comment does not exist.")
        return value


# ─── Like serializer ─────────────────────────────────────────────────────

class LikeSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Like
        fields = ["id", "user", "post", "comment", "createdAt"]
        read_only_fields = fields


# ─── Share serializers ───────────────────────────────────────────────────

class ShareSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Share
        fields = ["id", "user", "post", "platform", "createdAt"]
        read_only_fields = fields


class ShareCreateSerializer(serializers.Serializer):
    platform = serializers.CharField(required=False, allow_blank=True, allow_null=True)


# ─── Post serializers ───────────────────────────────────────────────────

class PostSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    commentsCount = serializers.SerializerMethodField()
    likesCount = serializers.SerializerMethodField()
    sharesCount = serializers.SerializerMethodField()
    isLiked = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id", "author", "type", "content", "images",
            "book_title", "book_author", "rating",
            "is_published", "is_reported", "view_count",
            "comments", "commentsCount", "likesCount", "sharesCount",
            "isLiked", "createdAt", "updatedAt",
        ]
        read_only_fields = [
            "id", "author", "is_reported", "view_count",
            "createdAt", "updatedAt",
        ]

    def get_comments(self, obj):
        top_level = obj.comments.filter(parent__isnull=True).select_related("author")[:5]
        return CommentSerializer(top_level, many=True, context=self.context).data

    def get_commentsCount(self, obj):
        return obj.comments.count()

    def get_likesCount(self, obj):
        return obj.likes.count()

    def get_sharesCount(self, obj):
        return obj.shares.count()

    def get_isLiked(self, obj):
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "content", "type", "images",
            "book_title", "book_author", "rating",
        ]

    def validate_rating(self, value):
        if value is not None and not (0 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 0 and 5.")
        return value


# ─── Follow serializer ──────────────────────────────────────────────────

class FollowSerializer(serializers.ModelSerializer):
    follower = UserPublicSerializer(read_only=True)
    following = UserPublicSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Follow
        fields = ["id", "follower", "following", "createdAt"]
        read_only_fields = fields
