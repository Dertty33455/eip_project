from rest_framework import viewsets, permissions
from .models import Analytics
from .serializers import AnalyticsSerializer

class AnalyticsViewSet(viewsets.ModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    permission_classes = [permissions.IsAdminUser]
