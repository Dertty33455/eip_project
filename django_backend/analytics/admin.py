from django.contrib import admin
from .models import Analytics

@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'metric', 'value', 'created_at')
    list_filter = ('date', 'metric')
    search_fields = ('metric',)
    readonly_fields = ('created_at',)
