from django.contrib import admin
from .models import Conversation, ConversationParticipant, Message

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participants', 'last_message_at', 'created_at')
    search_fields = ('participants__username',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    def get_participants(self, obj):
        return ', '.join([p.username for p in obj.participants.all()])

@admin.register(ConversationParticipant)
class ConversationParticipantAdmin(admin.ModelAdmin):
    list_display = ('user', 'conversation', 'unread_count', 'joined_at')
    search_fields = ('user__username', 'conversation__id')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'content', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__username', 'content')
    readonly_fields = ('id', 'created_at', 'updated_at')
