from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(User, related_name='conversations')
    
    last_message = models.TextField(blank=True, null=True)
    last_message_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-last_message_at', '-updated_at']
    
    def __str__(self):
        names = ', '.join([p.username for p in self.participants.all()])
        return f"Conversation: {names}"


class ConversationParticipant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='participant_records')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversation_participations')
    
    # User-specific data
    last_read_at = models.DateTimeField(null=True, blank=True)
    unread_count = models.IntegerField(default=0)
    
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['conversation', 'user']
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} in {self.conversation.id}"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # Attachments
    attachment_url = models.URLField(blank=True, null=True)
    attachment_type = models.CharField(max_length=50, blank=True, choices=[
        ('image', 'Image'),
        ('file', 'File'),
        ('audio', 'Audio'),
        ('video', 'Video'),
    ])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} in {self.conversation.id}"
