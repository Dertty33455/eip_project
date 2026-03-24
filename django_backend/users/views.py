from rest_framework import status, views, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, SubscriptionSerializer
from django.utils import timezone
from datetime import timedelta
from wallet.models import Wallet, Transaction
from .models import Subscription

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'token': str(refresh.access_token),
        'refresh': str(refresh),
    }

class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'token': tokens['token']
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Since authenticate expects username, and our frontend uses email for login
            try:
                user = User.objects.get(email=email)
                user = authenticate(username=user.username, password=password)
            except User.DoesNotExist:
                user = None

            if user is not None:
                tokens = get_tokens_for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'token': tokens['token']
                })
            else:
                return Response({"message": "Invalid credentials", "error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sub_data = None
        if hasattr(request.user, 'subscription'):
            sub = request.user.subscription
            if sub.status == 'ACTIVE' and sub.end_date < timezone.now():
                sub.status = 'EXPIRED'
                sub.save()
            if sub.status == 'ACTIVE':
                sub_data = SubscriptionSerializer(sub).data

        # The frontend expects { "user": User, "subscription": Subscription | null }
        return Response({
            'user': UserSerializer(request.user).data,
            'subscription': sub_data,
        })
        
class ProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True) # Usually patch
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'user': serializer.data
        })

class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # We can blacklist tokens if rest_framework_simplejwt.token_blacklist is installed
        # But for now, we just return a 200 OM
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)

class SubscriptionView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if hasattr(request.user, 'subscription') and request.user.subscription.status == 'ACTIVE':
            return Response(SubscriptionSerializer(request.user.subscription).data)
        return Response(None)

    def post(self, request):
        data = request.data
        plan = data.get('plan')
        provider = data.get('provider')
        phone_number = data.get('phoneNumber')

        plan_prices = {'MONTHLY': 2500, 'QUARTERLY': 6000, 'YEARLY': 20000}
        plan_days = {'MONTHLY': 30, 'QUARTERLY': 90, 'YEARLY': 365}

        if plan not in plan_prices:
             return Response({'error': 'Invalid plan'}, status=status.HTTP_400_BAD_REQUEST)

        price = plan_prices[plan]
        days = plan_days[plan]

        try:
            wallet = Wallet.objects.get(user=request.user)
        except Wallet.DoesNotExist:
            wallet = Wallet.objects.create(user=request.user)

        if provider == 'WALLET':
            if wallet.balance < price:
                return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
            wallet.balance -= price
            wallet.save()

        # Create Transaction
        Transaction.objects.create(
            wallet=wallet,
            reference=f"SUB-{request.user.id}-{int(timezone.now().timestamp())}",
            type='SUBSCRIPTION',
            amount=price,
            status='COMPLETED',
            description=f"Abonnement {plan}",
            payment_method=provider if provider else 'UNKNOWN'
        )

        end_date = timezone.now() + timedelta(days=days)

        if hasattr(request.user, 'subscription'):
            sub = request.user.subscription
            sub.plan = plan
            sub.status = 'ACTIVE'
            sub.end_date = end_date
            sub.save()
        else:
            sub = Subscription.objects.create(
                user=request.user,
                plan=plan,
                status='ACTIVE',
                end_date=end_date
            )

        return Response(SubscriptionSerializer(sub).data, status=status.HTTP_201_CREATED)
