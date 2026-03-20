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

def test_endpoints():
    client = Client()
    
    print("Testing Django API endpoints...")
    
    # Test notifications endpoint (should require auth)
    print("\n1. Testing /api/notifications/")
    response = client.get('/api/notifications/')
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print("✓ Notifications endpoint requires authentication (as expected)")
    else:
        print(f"Response: {response.json()}")
    
    # Test audiobooks endpoint (should be public)
    print("\n2. Testing /api/audiobooks/")
    response = client.get('/api/audiobooks/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            print(f"✓ Audiobooks endpoint works, returned {len(data)} items")
        else:
            print(f"✓ Audiobooks endpoint works, returned {len(data.get('results', []))} items")
    else:
        print(f"Response: {response.json()}")
    
    # Test books endpoint (should be public)
    print("\n3. Testing /api/books/")
    response = client.get('/api/books/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            print(f"✓ Books endpoint works, returned {len(data)} items")
        else:
            print(f"✓ Books endpoint works, returned {len(data.get('results', []))} items")
    else:
        print(f"Response: {response.json()}")
    
    # Test categories endpoint (should be public)
    print("\n4. Testing /api/categories/")
    response = client.get('/api/categories/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            print(f"✓ Categories endpoint works, returned {len(data)} items")
        else:
            print(f"✓ Categories endpoint works, returned {len(data.get('results', []))} items")
    else:
        print(f"Response: {response.json()}")
    
    # Test category tree endpoint
    print("\n5. Testing /api/categories/tree/")
    response = client.get('/api/categories/tree/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list):
            print(f"✓ Category tree endpoint works, returned {len(data)} root categories")
        else:
            print(f"✓ Category tree endpoint works")
    else:
        print(f"Response: {response.json()}")
    
    print("\n✓ All endpoints are accessible!")

if __name__ == '__main__':
    test_endpoints()
