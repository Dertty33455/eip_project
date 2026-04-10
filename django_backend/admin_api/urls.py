from django.urls import path
from . import views

urlpatterns = [
    path('stats', views.admin_stats, name='admin_stats'),
    path('top-books', views.top_books, name='top_books'),
    path('activities', views.recent_activities, name='recent_activities'),
    path('users', views.admin_users, name='admin_users'),
    path('reports', views.admin_reports, name='admin_reports'),
    path('orders/recent', views.recent_orders, name='recent_orders'),
]
