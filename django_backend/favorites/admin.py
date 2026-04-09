from django.contrib import admin
from .models import Favorite

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'audiobook', 'created_at')
    search_fields = ('user__username', 'book__title', 'audiobook__title')
    list_filter = ('created_at',)
