from django.contrib import admin
from .models import Post, Comment, Like, Share, Follow


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "type", "is_published", "is_reported", "view_count", "created_at")
    list_filter = ("type", "is_published", "is_reported", "created_at")
    search_fields = ("content", "author__username", "book_title")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "post", "parent", "is_reported", "created_at")
    list_filter = ("is_reported", "created_at")
    search_fields = ("content", "author__username")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "comment", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username",)
    readonly_fields = ("id", "created_at")


@admin.register(Share)
class ShareAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "platform", "created_at")
    list_filter = ("platform", "created_at")
    search_fields = ("user__username",)
    readonly_fields = ("id", "created_at")


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ("id", "follower", "following", "created_at")
    list_filter = ("created_at",)
    search_fields = ("follower__username", "following__username")
    readonly_fields = ("id", "created_at")
