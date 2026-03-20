from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    isRead = serializers.BooleanField(source='is_read', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message', 'isRead', 'createdAt',
            'related_user', 'related_object_id', 'related_object_type'
        ]
        read_only_fields = ['id', 'createdAt']

class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'user', 'type', 'title', 'message',
            'related_user', 'related_object_id', 'related_object_type'
        ]
