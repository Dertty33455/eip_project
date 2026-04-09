from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Conversation, ConversationParticipant, Message
from .serializers import (
    ConversationDetailSerializer, ConversationListSerializer,
    ConversationParticipantSerializer, MessageSerializer
)


class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get conversations for current user"""
        return Conversation.objects.filter(participants=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ConversationDetailSerializer
        return ConversationListSerializer
    
    @action(detail=False, methods=['post'])
    def start_conversation(self, request):
        """Start a new conversation with another user or users"""
        other_user_ids = request.data.get('user_ids', [])
        
        if not other_user_ids:
            return Response({'error': 'At least one user is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check if conversation already exists
        participants = [request.user.id] + other_user_ids
        
        existing = Conversation.objects.filter(participants__in=participants).annotate(
            participant_count=models.Count('participants')
        ).filter(participant_count=len(participants))
        
        if existing.exists():
            conversation = existing.first()
        else:
            conversation = Conversation.objects.create()
            for user_id in participants:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                try:
                    user = User.objects.get(id=user_id)
                    conversation.participants.add(user)
                    ConversationParticipant.objects.get_or_create(
                        conversation=conversation,
                        user=user
                    )
                except User.DoesNotExist:
                    pass
        
        serializer = ConversationDetailSerializer(conversation, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages in a conversation"""
        conversation = self.get_object()
        messages = conversation.messages.filter(deleted_at__isnull=True)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message to conversation"""
        conversation = self.get_object()
        
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'error': 'Message content is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content,
            attachment_url=request.data.get('attachment_url'),
            attachment_type=request.data.get('attachment_type'),
        )
        
        # Update conversation's last message
        from django.utils import timezone
        conversation.last_message = content
        conversation.last_message_at = timezone.now()
        conversation.save()
        
        # Mark as read for sender
        message.is_read = True
        message.save()
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark all messages in conversation as read"""
        conversation = self.get_object()
        
        # Update user's participant record
        participant = ConversationParticipant.objects.get(
            conversation=conversation,
            user=request.user
        )
        from django.utils import timezone
        participant.last_read_at = timezone.now()
        participant.unread_count = 0
        participant.save()
        
        # Mark messages as read
        conversation.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        
        return Response({'status': 'marked as read'})


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see messages in their conversations"""
        return Message.objects.filter(conversation__participants=self.request.user)
    
    @action(detail=True, methods=['post'])
    def delete_message(self, request, pk=None):
        """Soft delete a message"""
        message = self.get_object()
        if message.sender != request.user:
            return Response({'error': 'You can only delete your own messages'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        from django.utils import timezone
        message.deleted_at = timezone.now()
        message.save()
        
        return Response({'status': 'message deleted'})


# Import models here to avoid circular imports
from django.db import models
