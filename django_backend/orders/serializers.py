from rest_framework import serializers
from .models import Order, OrderItem, Invoice

class OrderItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    audiobook_title = serializers.CharField(source='audiobook.title', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'book', 'audiobook', 'product_title', 'product_price', 'quantity', 'subtotal', 'book_title', 'audiobook_title', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_username = serializers.CharField(source='buyer.username', read_only=True)
    seller_username = serializers.CharField(source='seller.username', read_only=True, allow_null=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'buyer', 'seller', 'buyer_username', 'seller_username', 'status', 
                  'subtotal', 'commission', 'seller_amount', 'delivery_fee', 'total_amount', 'currency',
                  'delivery_type', 'delivery_address', 'delivery_city', 'delivery_country', 'delivery_phone',
                  'tracking_number', 'notes', 'items', 'paid_at', 'shipped_at', 'delivered_at', 'cancelled_at',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class InvoiceSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    buyer_name = serializers.CharField(source='buyer.email', read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'order', 'order_number', 'seller', 'buyer', 'seller_name', 'buyer_name',
                  'status', 'subtotal', 'tax_amount', 'total_amount', 'tax_rate', 'notes',
                  'issued_at', 'due_date', 'paid_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'invoice_number', 'created_at', 'updated_at']
