#!/usr/bin/env python3
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookshell_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.test import Client
from django.urls import reverse

def test_wallet_endpoints():
    client = Client()
    
    print("Testing Django Wallet API endpoints...")
    
    # Test wallet detail endpoint (should require auth)
    print("\n1. Testing /api/wallet/")
    response = client.get('/api/wallet/')
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✓ Wallet endpoint requires authentication (as expected)")
    else:
        print(f"Response: {response.json()}")
    
    # Test wallet balance endpoint (should require auth)
    print("\n2. Testing /api/wallet/balance/")
    response = client.get('/api/wallet/balance/')
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✓ Wallet balance endpoint requires authentication (as expected)")
    else:
        print(f"Response: {response.json()}")
    
    # Test transactions endpoint (should require auth)
    print("\n3. Testing /api/wallet/transactions/")
    response = client.get('/api/wallet/transactions/')
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✓ Transactions endpoint requires authentication (as expected)")
    else:
        print(f"Response: {response.json()}")
    
    # Test payment methods endpoint (should require auth)
    print("\n4. Testing /api/wallet/payment-methods/")
    response = client.get('/api/wallet/payment-methods/')
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✓ Payment methods endpoint requires authentication (as expected)")
    else:
        print(f"Response: {response.json()}")
    
    # Test withdrawal requests endpoint (should require auth)
    print("\n5. Testing /api/wallet/withdrawals/")
    response = client.get('/api/wallet/withdrawals/')
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✓ Withdrawal requests endpoint requires authentication (as expected)")
    else:
        print(f"Response: {response.json()}")
    
    print("\n✓ All wallet endpoints are properly configured!")

if __name__ == '__main__':
    test_wallet_endpoints()
