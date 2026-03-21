from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Follow


@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    """Create a notification when a user gains a new follower."""
    if not created:
        return

    # Import here to avoid circular imports
    from notifications.models import Notification

    Notification.objects.create(
        user=instance.following,
        type="FOLLOW",
        title="Nouveau follower",
        message=f"{instance.follower.username} a commencé à vous suivre.",
        related_user=instance.follower,
        related_object_id=instance.id,
        related_object_type="follow",
    )
