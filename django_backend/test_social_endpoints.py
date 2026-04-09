#!/usr/bin/env python3
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookshell_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import uuid

User = get_user_model()

def test_social_endpoints():
    client = Client()
    print("Testing Social API endpoints...")
    
    # Check if a user exists or create a dummy one for auth
    user = User.objects.filter(username='test_social_user').first()
    if not user:
        user = User.objects.create_user(username='test_social_user', password='password123', email='test_social@example.com')
        print("Created dummy user 'test_social_user'.")
    
    # We need to authenticate using simplejwt
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    
    # The client can send the token in the headers
    auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
    print("\n✓ User authenticated via JWT.")

    # 1. Test POST /api/social/posts/ (Create Post)
    print("\n1. Testing POST /api/social/posts/")
    payload = {
        "type": "TEXT",
        "content": "This is a test post for verifying social endpoints!"
    }
    response = client.post('/api/social/posts/', data=payload, content_type='application/json', **auth_headers)
    print(f"Status: {response.status_code}")
    if response.status_code in [200, 201]:
        resp_json = response.json()
        print("✓ Post created successfully:", resp_json.get('post', {}).get('id'))
        post_id = resp_json.get('post', {}).get('id') or resp_json.get('id')
    else:
        print(f"Response: {response.json()}")
        post_id = None

    # 2. Test GET /api/social/posts/ (List Posts)
    print("\n2. Testing GET /api/social/posts/")
    response = client.get('/api/social/posts/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Posts fetched successfully. Count: {len(data.get('results', data))}")
    else:
        print(f"Response: {response.json()}")

    if post_id:
        # 3. Test GET /api/social/posts/{id}/
        print(f"\n3. Testing GET /api/social/posts/{post_id}/")
        response = client.get(f'/api/social/posts/{post_id}/', **auth_headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✓ Post detail fetched successfully.")
        else:
            print(f"Response: {response.json()}")

        # 4. Test POST to like a post
        print(f"\n4. Testing POST /api/social/posts/{post_id}/like/")
        response = client.post(f'/api/social/posts/{post_id}/like/', **auth_headers)
        print(f"Status: {response.status_code}")
        if response.status_code in [200, 201]:
            print("✓ Post liked successfully.")
        else:
            print(f"Response: {response.json()}")

        # 5. Test POST to comment on a post
        print(f"\n5. Testing POST /api/social/posts/{post_id}/comment/")
        comment_payload = {"content": "This is a test comment."}
        response = client.post(f'/api/social/posts/{post_id}/comment/', data=comment_payload, content_type='application/json', **auth_headers)
        print(f"Status: {response.status_code}")
        if response.status_code in [200, 201]:
            print("✓ Comment created successfully.")
        else:
            print(f"Response: {response.json()}")

    # 6. Test GET /api/social/feed/
    print("\n6. Testing GET /api/social/feed/")
    response = client.get('/api/social/feed/', **auth_headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✓ Feed fetched successfully.")
    else:
        print(f"Response: {response.json()}")

if __name__ == '__main__':
    test_social_endpoints()
