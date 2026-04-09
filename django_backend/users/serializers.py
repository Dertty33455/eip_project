from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from .models import Subscription, VerificationToken, UserActivity

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', required=False)
    lastName = serializers.CharField(source='last_name', required=False)
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'firstName', 'lastName', 'username',
            'avatar', 'bio', 'location', 'country', 'role', 'status',
            'isVerifiedSeller', 'isEmailVerified', 'isPhoneVerified',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'status', 'isVerifiedSeller', 'isEmailVerified', 'isPhoneVerified', 'createdAt', 'updatedAt']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    firstName = serializers.CharField(source='first_name', required=True)
    lastName = serializers.CharField(source='last_name', required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'firstName', 'lastName', 'username', 'phone', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'USER')
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class SubscriptionSerializer(serializers.ModelSerializer):
    # Mapping to camelCase for frontend compatibility 
    startDate = serializers.DateTimeField(source='start_date', read_only=True)
    endDate = serializers.DateTimeField(source='end_date', read_only=True)
    
    class Meta:
        from .models import Subscription
        model = Subscription
        fields = ['id', 'plan', 'status', 'startDate', 'endDate']
        read_only_fields = ['id', 'status', 'startDate', 'endDate']


class VerificationTokenSerializer(serializers.ModelSerializer):
    """Serializer for email/phone verification tokens."""
    
    class Meta:
        model = VerificationToken
        fields = ['id', 'user', 'token', 'type', 'is_used', 'used_at', 'expires_at', 'created_at']
        read_only_fields = ['id', 'token', 'used_at', 'created_at']


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for user activity tracking."""
    username = serializers.CharField(source='user.username', read_only=True)
    related_username = serializers.CharField(source='related_user.username', read_only=True, allow_null=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'username', 'activity_type', 'description',
            'related_user', 'related_username', 'related_object_id', 'related_object_type',
            'ip_address', 'user_agent', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
