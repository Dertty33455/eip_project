from rest_framework import serializers
from .models import Analytics, UserActivity

class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = '__all__'


class UserActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    activity_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'username', 'activity_type', 'activity_display', 
                  'description', 'related_user_id', 'related_object_id', 'related_object_type',
                  'ip_address', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']
