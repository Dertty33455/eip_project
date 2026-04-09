from django.contrib import admin
from .models import Audiobook, AudioChapter, AudiobookProgress, AudiobookRating


class AudioChapterInline(admin.TabularInline):
    """
    Inline admin for AudioChapter to manage chapters within audiobook admin view.
    """
    model = AudioChapter
    extra = 1
    fields = ['title', 'chapter_number', 'duration_minutes', 'audio_url', 'is_free']


@admin.register(Audiobook)
class AudiobookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'narrator', 'genre', 'language', 'price', 'created_at']
    list_filter = ['genre', 'language', 'is_free', 'is_premium', 'created_at']
    search_fields = ['title', 'author', 'description']
    inlines = [AudioChapterInline]


@admin.register(AudioChapter)
class AudioChapterAdmin(admin.ModelAdmin):
    list_display = ['audiobook', 'chapter_number', 'title', 'duration_minutes', 'is_free', 'created_at']
    list_filter = ['audiobook', 'is_free', 'created_at']
    search_fields = ['title', 'audiobook__title']
    ordering = ['audiobook', 'chapter_number']


@admin.register(AudiobookProgress)
class AudiobookProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'audiobook', 'chapter', 'current_position', 'is_completed', 'last_played_at']
    list_filter = ['is_completed', 'last_played_at']
    search_fields = ['user__username', 'audiobook__title']


@admin.register(AudiobookRating)
class AudiobookRatingAdmin(admin.ModelAdmin):
    list_display = ['user', 'audiobook', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'audiobook__title', 'review']

