from django.urls import path
from .views import (
    NotificationListView, NotificationDetailView, 
    MarkAsReadView, MarkAllAsReadView, UnreadCountView,
    NotificationCreateView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('create/', NotificationCreateView.as_view(), name='notification-create'),
    path('unread-count/', UnreadCountView.as_view(), name='unread-count'),
    path('mark-all-read/', MarkAllAsReadView.as_view(), name='mark-all-read'),
    path('<uuid:notification_id>/mark-read/', MarkAsReadView.as_view(), name='mark-read'),
    path('<uuid:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
]
