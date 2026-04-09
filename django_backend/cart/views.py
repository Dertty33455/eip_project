from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from books.models import Book
from audiobooks.models import Audiobook


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own cart"""
        return Cart.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """Get or create user's cart"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        
        book_id = request.data.get('book_id')
        audiobook_id = request.data.get('audiobook_id')
        quantity = int(request.data.get('quantity', 1))
        
        if not book_id and not audiobook_id:
            return Response({'error': 'Either book_id or audiobook_id is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if book_id:
            try:
                book = Book.objects.get(id=book_id)
                item, created = CartItem.objects.get_or_create(
                    cart=cart, book=book, audiobook=None,
                    defaults={'product_title': book.title, 'product_price': book.price, 'quantity': quantity}
                )
                if not created:
                    item.quantity += quantity
                    item.save()
                serializer = CartItemSerializer(item)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Book.DoesNotExist:
                return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if audiobook_id:
            try:
                audiobook = Audiobook.objects.get(id=audiobook_id)
                item, created = CartItem.objects.get_or_create(
                    cart=cart, audiobook=audiobook, book=None,
                    defaults={'product_title': audiobook.title, 'product_price': audiobook.price, 'quantity': quantity}
                )
                if not created:
                    item.quantity += quantity
                    item.save()
                serializer = CartItemSerializer(item)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Audiobook.DoesNotExist:
                return Response({'error': 'Audiobook not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item_id = request.data.get('item_id')
        
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()
            cart.update_totals()
            serializer = self.get_serializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """Update item quantity"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({'error': 'Quantity must be greater than 0'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.quantity = quantity
            item.save()
            serializer = CartItemSerializer(item)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear all items from cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        cart.update_totals()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can only manage their own cart items"""
        return CartItem.objects.filter(cart__user=self.request.user)
