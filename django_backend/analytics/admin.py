from django.contrib import admin
from .models import Analytics, UserActivity

@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'metric', 'value', 'created_at')
    list_filter = ('date', 'metric')
    search_fields = ('metric',)
    readonly_fields = ('created_at',)

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'description', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__username', 'description')
    readonly_fields = ('id', 'created_at')
    
    def has_add_permission(self, request):
        # Activities are created programmatically, not via admin
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Keep activity logs
        return False
