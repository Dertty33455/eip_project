from django.db.models import Count, Sum, Q
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from datetime import timedelta
from calendar import monthrange

from django.contrib.auth import get_user_model
from books.models import Book
from audiobooks.models import Audiobook
from orders.models import Order, OrderItem
from reports.models import Report
from users.models import UserActivity
from users.serializers import UserSerializer
from reviews.serializers import ReviewSerializer
from orders.serializers import OrderSerializer

User = get_user_model()


def calculate_growth(current, previous):
    """Calculate percentage growth between two values"""
    if previous == 0:
        return 100 if current > 0 else 0
    return round(((current - previous) / previous) * 100, 2)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    """Get dashboard statistics"""
    # Check admin permission
    if request.user.role != 'ADMIN':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    now = timezone.now()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Previous month
    prev_month_end = start_of_month - timedelta(days=1)
    prev_month_start = prev_month_end.replace(day=1)
    
    # Totals
    total_users = User.objects.count()
    total_books = Book.objects.count()
    total_audiobooks = Audiobook.objects.count()
    total_revenue = Order.objects.filter(status='DELIVERED').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    total_orders = Order.objects.count()
    pending_orders = Order.objects.filter(status='PENDING').count()
    total_reports = Report.objects.filter(status='PENDING').count()
    
    # This month vs last month (Users use date_joined, not created_at)
    users_this_month = User.objects.filter(date_joined__gte=start_of_month).count()
    users_last_month = User.objects.filter(
        date_joined__gte=prev_month_start,
        date_joined__lt=start_of_month
    ).count()
    user_growth = calculate_growth(users_this_month, users_last_month)
    
    books_this_month = Book.objects.filter(created_at__gte=start_of_month).count()
    books_last_month = Book.objects.filter(
        created_at__gte=prev_month_start,
        created_at__lt=start_of_month
    ).count()
    book_growth = calculate_growth(books_this_month, books_last_month)
    
    revenue_this_month = Order.objects.filter(
        status='DELIVERED',
        created_at__gte=start_of_month
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    revenue_last_month = Order.objects.filter(
        status='DELIVERED',
        created_at__gte=prev_month_start,
        created_at__lt=start_of_month
    ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    revenue_growth = calculate_growth(revenue_this_month, revenue_last_month)
    
    return Response({
        'totalUsers': total_users,
        'totalBooks': total_books,
        'totalAudiobooks': total_audiobooks,
        'totalRevenue': total_revenue,
        'totalOrders': total_orders,
        'pendingOrders': pending_orders,
        'totalReports': total_reports,
        'userGrowth': user_growth,
        'bookGrowth': book_growth,
        'revenueGrowth': revenue_growth,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_books(request):
    """Get top books by sales"""
    if request.user.role != 'ADMIN':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    top_books_data = OrderItem.objects.filter(book__isnull=False).values(
        'book_id',
        'book__title',
        'book__author'
    ).annotate(
        sales=Count('id'),
        revenue=Sum('subtotal')
    ).order_by('-sales')[:5]
    
    result = []
    for item in top_books_data:
        if item['book_id']:
            result.append({
                'id': str(item['book_id']),
                'title': item['book__title'],
                'author': item['book__author'] or 'Unknown',
                'sales': item['sales'],
                'revenue': float(item['revenue'] or 0),
            })
    
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activities(request):
    """Get recent user activities"""
    if request.user.role != 'ADMIN':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    limit = request.query_params.get('limit', 8)
    try:
        limit = min(int(limit), 100)
    except (ValueError, TypeError):
        limit = 8
    
    activities = UserActivity.objects.select_related('user').order_by('-created_at')[:limit]
    
    result = []
    for activity in activities:
        result.append({
            'id': str(activity.id),
            'user': {
                'id': str(activity.user.id),
                'username': activity.user.username,
                'firstName': activity.user.first_name,
                'lastName': activity.user.last_name,
                'avatar': activity.user.avatar,
            },
            'action': activity.action,
            'description': activity.description or '',
            'metadata': activity.metadata or {},
            'createdAt': activity.created_at.isoformat(),
        })
    
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users(request):
    """Get list of users for admin"""
    if request.user.role != 'ADMIN':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    limit = request.query_params.get('limit', 5)
    try:
        limit = min(int(limit), 100)
    except (ValueError, TypeError):
        limit = 5
    
    users = User.objects.order_by('-date_joined')[:limit]
    serializer = UserSerializer(users, many=True)
    
    return Response({
        'data': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_reports(request):
    """Get reports for admin"""
    if request.user.role != 'ADMIN':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    status_filter = request.query_params.get('status', 'PENDING')
    limit = request.query_params.get('limit', 5)
    try:
        limit = min(int(limit), 100)
    except (ValueError, TypeError):
        limit = 5
    
    reports = Report.objects.filter(status=status_filter).order_by('-created_at')[:limit]
    
    result = []
    for report in reports:
        result.append({
            'id': str(report.id),
            'type': report.type,
            'reason': report.reason,
            'description': report.description or '',
            'status': report.status,
            'createdAt': report.created_at.isoformat(),
        })
    
    return Response({
        'data': result
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_orders(request):
    """Get recent orders"""
    if request.user.role != 'ADMIN':
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    limit = request.query_params.get('limit', 5)
    try:
        limit = min(int(limit), 100)
    except (ValueError, TypeError):
        limit = 5
    
    orders = Order.objects.select_related('buyer').order_by('-created_at')[:limit]
    
    result = []
    for order in orders:
        result.append({
            'id': str(order.id),
            'orderNumber': order.order_number or f'ORD-{order.id.hex[:8].upper()}',
            'totalAmount': float(order.total_amount),
            'status': order.status,
            'buyer': {
                'firstName': order.buyer.first_name,
                'lastName': order.buyer.last_name,
                'email': order.buyer.email,
            },
            'createdAt': order.created_at.isoformat(),
        })
    
    return Response({
        'data': result
    })
