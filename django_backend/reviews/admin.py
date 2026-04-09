from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'book', 'audiobook', 'rating', 'is_verified_purchase', 'created_at')
    list_filter = ('rating', 'is_verified_purchase', 'is_reported', 'created_at')
    search_fields = ('reviewer__username', 'book__title', 'audiobook__title', 'title')
    readonly_fields = ('helpful_count', 'unhelpful_count', 'created_at', 'updated_at')
