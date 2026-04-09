from rest_framework import serializers
from .models import Conversation, ConversationParticipant, Message

class ConversationParticipantSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    avatar = serializers.CharField(source='user.avatar', read_only=True)
    
    class Meta:
        model = ConversationParticipant
        fields = ['id', 'conversation', 'user', 'username', 'email', 'avatar', 'last_read_at', 'unread_count', 'joined_at']
        read_only_fields = ['id', 'joined_at']


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_avatar = serializers.CharField(source='sender.avatar', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_username', 'sender_avatar', 'content', 
                  'is_read', 'attachment_url', 'attachment_type', 'created_at', 'updated_at', 'deleted_at']
        read_only_fields = ['id', 'sender', 'created_at', 'updated_at']


class ConversationDetailSerializer(serializers.ModelSerializer):
    participants = ConversationParticipantSerializer(source='participant_records', many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'messages', 'last_message', 'last_message_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ConversationListSerializer(serializers.ModelSerializer):
    participant_usernames = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'participant_usernames', 'unread_count', 'last_message', 'last_message_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_participant_usernames(self, obj):
        return [p.username for p in obj.participants.all()]
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request:
            try:
                participant = obj.participant_records.get(user=request.user)
                return participant.unread_count
            except:
                return 0
        return 0
