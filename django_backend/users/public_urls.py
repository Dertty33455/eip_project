from django.urls import path
from .public_views import PublicProfileView

urlpatterns = [
    path('<str:username>', PublicProfileView.as_view(), name='public-profile'),
]
