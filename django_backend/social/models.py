import uuid

from django.conf import settings
from django.db import models


class Post(models.Model):
    """A social publication — text, review, or media post."""

    TYPE_CHOICES = (
        ("TEXT", "Text"),
        ("REVIEW", "Review"),
        ("IMAGE", "Image"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="TEXT")
    content = models.TextField()
    images = models.JSONField(default=list, blank=True)
    book_title = models.CharField(max_length=255, blank=True, null=True)
    book_author = models.CharField(max_length=255, blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    is_published = models.BooleanField(default=True)
    is_reported = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Post by {self.author.username} — {self.type}"


class Comment(models.Model):
    """A comment on a post, optionally threaded via parent."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="comments"
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="social_comments",
    )
    content = models.TextField()
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies",
    )
    is_reported = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post_id}"


class Like(models.Model):
    """A like on a post or comment. Exactly one of post/comment must be set."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="social_likes",
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="likes",
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="likes",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="unique_user_post_like",
                condition=models.Q(post__isnull=False),
            ),
            models.UniqueConstraint(
                fields=["user", "comment"],
                name="unique_user_comment_like",
                condition=models.Q(comment__isnull=False),
            ),
        ]

    def __str__(self):
        target = f"post {self.post_id}" if self.post_id else f"comment {self.comment_id}"
        return f"Like by {self.user.username} on {target}"


class Share(models.Model):
    """A share / repost of a post, optionally indicating a platform."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="social_shares",
    )
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="shares"
    )
    platform = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Share by {self.user.username} on post {self.post_id}"


class Follow(models.Model):
    """A follow relationship between two users."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="following_set",
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="followers_set",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"],
                name="unique_follow",
            ),
        ]

    def __str__(self):
        return f"{self.follower.username} → {self.following.username}"
