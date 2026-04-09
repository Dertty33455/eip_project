from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User, Subscription, VerificationToken, UserActivity

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ('username', 'email', 'role', 'status', 'isEmailVerified', 'isVerifiedSeller', 'date_joined')
    list_filter = ('role', 'status', 'isEmailVerified', 'isVerifiedSeller', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    readonly_fields = ('id', 'date_joined', 'updatedAt')
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('id', 'phone', 'avatar', 'bio', 'location', 'country', 'role', 'status', 'isEmailVerified', 'isPhoneVerified', 'isVerifiedSeller')}),
    )

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'status', 'start_date', 'end_date')
    list_filter = ('plan', 'status', 'start_date')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('id', 'start_date')

@admin.register(VerificationToken)
class VerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'is_used', 'expires_at', 'created_at')
    list_filter = ('type', 'is_used', 'created_at')
    search_fields = ('user__username', 'token')
    readonly_fields = ('id', 'token', 'created_at')
    
    def has_add_permission(self, request):
        # Tokens are generated programmatically
        return False


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'description', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__username', 'user__email', 'description')
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('User Information', {
            'fields': ('id', 'user', 'related_user')
        }),
        ('Activity Details', {
            'fields': ('activity_type', 'description')
        }),
        ('Related Object', {
            'fields': ('related_object_id', 'related_object_type'),
            'classes': ('collapse',)
        }),
        ('Meta Information', {
            'fields': ('ip_address', 'user_agent', 'metadata'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Activities are logged programmatically
        return False

