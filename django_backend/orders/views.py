from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem, Invoice
from .serializers import OrderSerializer, OrderItemSerializer, InvoiceSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can see their own orders or orders they're selling"""
        user = self.request.user
        return Order.objects.filter(buyer=user) | Order.objects.filter(seller=user)
    
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get all orders for the current user as buyer"""
        orders = Order.objects.filter(buyer=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def selling(self, request):
        """Get all orders for the current user as seller"""
        orders = Order.objects.filter(seller=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark order as paid"""
        order = self.get_object()
        order.status = 'PAID'
        from django.utils import timezone
        order.paid_at = timezone.now()
        order.save()
        return Response({'status': 'order marked as paid'})
    
    @action(detail=True, methods=['post'])
    def mark_shipped(self, request, pk=None):
        """Mark order as shipped"""
        order = self.get_object()
        if request.data.get('tracking_number'):
            order.tracking_number = request.data['tracking_number']
        order.status = 'SHIPPED'
        from django.utils import timezone
        order.shipped_at = timezone.now()
        order.save()
        return Response({'status': 'order marked as shipped'})
    
    @action(detail=True, methods=['post'])
    def mark_delivered(self, request, pk=None):
        """Mark order as delivered"""
        order = self.get_object()
        order.status = 'DELIVERED'
        from django.utils import timezone
        order.delivered_at = timezone.now()
        order.save()
        return Response({'status': 'order marked as delivered'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        if order.status not in ['PENDING', 'PAID']:
            return Response({'error': 'Cannot cancel order in this status'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'CANCELLED'
        from django.utils import timezone
        order.cancelled_at = timezone.now()
        order.save()
        return Response({'status': 'order cancelled'})


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can see invoices they sent or received"""
        user = self.request.user
        return Invoice.objects.filter(seller=user) | Invoice.objects.filter(buyer=user)
    
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark invoice as paid"""
        invoice = self.get_object()
        invoice.status = 'PAID'
        from django.utils import timezone
        invoice.paid_at = timezone.now()
        invoice.save()
        return Response({'status': 'invoice marked as paid'})
