from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, MeView, ProfileUpdateView, LogoutView,
    UserActivityViewSet, VerificationTokenViewSet
)

router = DefaultRouter()
router.register(r'activities', UserActivityViewSet, basename='user-activity')
router.register(r'verification-tokens', VerificationTokenViewSet, basename='verification-token')

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('me', MeView.as_view(), name='me'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileUpdateView.as_view(), name='profile-update'),
    path('', include(router.urls)),
]
