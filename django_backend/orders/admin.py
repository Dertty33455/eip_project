from django.contrib import admin
from .models import Order, OrderItem, Invoice

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'buyer', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at', 'delivery_type')
    search_fields = ('order_number', 'buyer__username', 'delivery_address')
    readonly_fields = ('order_number', 'created_at', 'updated_at')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product_title', 'order', 'quantity', 'subtotal')
    list_filter = ('created_at',)
    search_fields = ('product_title', 'order__order_number')

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'seller', 'buyer', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('invoice_number', 'order__order_number')
    readonly_fields = ('invoice_number', 'created_at', 'updated_at')
