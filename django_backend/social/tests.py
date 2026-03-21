from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from .models import Post, Comment, Like, Share, Follow
from notifications.models import Notification

User = get_user_model()


class SocialTestMixin:
    """Helper mixin to create users and set auth credentials."""

    def create_user(self, username="alice", email="alice@example.com",
                    password="StrongP@ss123"):
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=username.capitalize(),
            last_name="Test",
        )
        return user

    def auth(self, user):
        """Authenticate via JWT and set credentials on the test client."""
        from rest_framework_simplejwt.tokens import RefreshToken
        token = str(RefreshToken.for_user(user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")


# ─────────────────────────────────────────────────────────────────────────
#  Post Tests
# ─────────────────────────────────────────────────────────────────────────

class PostTests(SocialTestMixin, APITestCase):

    def setUp(self):
        self.user = self.create_user()
        self.other = self.create_user("bob", "bob@example.com")

    # ── List ──────────────────────────────────────────────────────────

    def test_list_posts_public(self):
        """Unauthenticated users can list published posts."""
        Post.objects.create(author=self.user, content="Hello world")
        response = self.client.get(reverse("post-list-create"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_list_posts_excludes_unpublished(self):
        Post.objects.create(author=self.user, content="Draft", is_published=False)
        response = self.client.get(reverse("post-list-create"))
        self.assertEqual(response.data["count"], 0)

    # ── Create ────────────────────────────────────────────────────────

    def test_create_post_authenticated(self):
        self.auth(self.user)
        data = {"content": "My first post", "type": "TEXT"}
        response = self.client.post(reverse("post-list-create"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("post", response.data)
        self.assertEqual(response.data["post"]["content"], "My first post")
        self.assertEqual(response.data["post"]["author"]["username"], "alice")

    def test_create_post_unauthenticated(self):
        response = self.client.post(
            reverse("post-list-create"), {"content": "No auth"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_review_post(self):
        self.auth(self.user)
        data = {
            "content": "Great book!",
            "type": "REVIEW",
            "book_title": "Django for APIs",
            "book_author": "William S. Vincent",
            "rating": 5,
        }
        response = self.client.post(reverse("post-list-create"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["post"]["book_title"], "Django for APIs")
        self.assertEqual(response.data["post"]["rating"], 5)

    # ── Detail / Update / Delete ──────────────────────────────────────

    def test_get_post_detail(self):
        post = Post.objects.create(author=self.user, content="Detailed post")
        response = self.client.get(reverse("post-detail", args=[post.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Detailed post")

    def test_update_own_post(self):
        post = Post.objects.create(author=self.user, content="Old content")
        self.auth(self.user)
        response = self.client.patch(
            reverse("post-detail", args=[post.pk]),
            {"content": "Updated content"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post.refresh_from_db()
        self.assertEqual(post.content, "Updated content")

    def test_cannot_update_others_post(self):
        post = Post.objects.create(author=self.user, content="Alice's post")
        self.auth(self.other)
        response = self.client.patch(
            reverse("post-detail", args=[post.pk]),
            {"content": "Hacked"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_post(self):
        post = Post.objects.create(author=self.user, content="To delete")
        self.auth(self.user)
        response = self.client.delete(reverse("post-detail", args=[post.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(pk=post.pk).exists())

    def test_cannot_delete_others_post(self):
        post = Post.objects.create(author=self.user, content="Protected")
        self.auth(self.other)
        response = self.client.delete(reverse("post-detail", args=[post.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# ─────────────────────────────────────────────────────────────────────────
#  Like Tests
# ─────────────────────────────────────────────────────────────────────────

class LikeTests(SocialTestMixin, APITestCase):

    def setUp(self):
        self.user = self.create_user()
        self.post = Post.objects.create(author=self.user, content="Likeable post")

    def test_like_post(self):
        self.auth(self.user)
        response = self.client.post(reverse("post-like", args=[self.post.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["likes_count"], 1)

    def test_unlike_post(self):
        self.auth(self.user)
        # Like first
        self.client.post(reverse("post-like", args=[self.post.pk]))
        # Then unlike
        response = self.client.post(reverse("post-like", args=[self.post.pk]))
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["likes_count"], 0)

    def test_like_count_multiple_users(self):
        other = self.create_user("bob", "bob@example.com")
        self.auth(self.user)
        self.client.post(reverse("post-like", args=[self.post.pk]))
        self.auth(other)
        response = self.client.post(reverse("post-like", args=[self.post.pk]))
        self.assertEqual(response.data["likes_count"], 2)

    def test_is_liked_flag_in_post(self):
        self.auth(self.user)
        self.client.post(reverse("post-like", args=[self.post.pk]))
        response = self.client.get(reverse("post-detail", args=[self.post.pk]))
        self.assertTrue(response.data["isLiked"])


# ─────────────────────────────────────────────────────────────────────────
#  Comment Tests
# ─────────────────────────────────────────────────────────────────────────

class CommentTests(SocialTestMixin, APITestCase):

    def setUp(self):
        self.user = self.create_user()
        self.other = self.create_user("bob", "bob@example.com")
        self.post = Post.objects.create(author=self.user, content="Commentable")

    def test_comment_on_post(self):
        self.auth(self.user)
        response = self.client.post(
            reverse("post-comment", args=[self.post.pk]),
            {"content": "Nice post!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["comment"]["content"], "Nice post!")
        self.assertEqual(response.data["comments_count"], 1)

    def test_nested_reply(self):
        self.auth(self.user)
        # Create parent comment
        res1 = self.client.post(
            reverse("post-comment", args=[self.post.pk]),
            {"content": "Parent"},
            format="json",
        )
        parent_id = res1.data["comment"]["id"]
        # Reply
        res2 = self.client.post(
            reverse("post-comment", args=[self.post.pk]),
            {"content": "Reply", "parent_id": parent_id},
            format="json",
        )
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(str(res2.data["comment"]["parent"]), str(parent_id))

    def test_list_comments(self):
        Comment.objects.create(post=self.post, author=self.user, content="C1")
        Comment.objects.create(post=self.post, author=self.user, content="C2")
        response = self.client.get(reverse("post-comments", args=[self.post.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_update_own_comment(self):
        comment = Comment.objects.create(
            post=self.post, author=self.user, content="Original"
        )
        self.auth(self.user)
        response = self.client.put(
            reverse("comment-detail", args=[comment.pk]),
            {"content": "Edited"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment.refresh_from_db()
        self.assertEqual(comment.content, "Edited")

    def test_cannot_update_others_comment(self):
        comment = Comment.objects.create(
            post=self.post, author=self.user, content="Protected"
        )
        self.auth(self.other)
        response = self.client.put(
            reverse("comment-detail", args=[comment.pk]),
            {"content": "Hacked"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_comment(self):
        comment = Comment.objects.create(
            post=self.post, author=self.user, content="Delete me"
        )
        self.auth(self.user)
        response = self.client.delete(reverse("comment-detail", args=[comment.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


# ─────────────────────────────────────────────────────────────────────────
#  Share Tests
# ─────────────────────────────────────────────────────────────────────────

class ShareTests(SocialTestMixin, APITestCase):

    def setUp(self):
        self.user = self.create_user()
        self.post = Post.objects.create(author=self.user, content="Shareable")

    def test_share_post(self):
        self.auth(self.user)
        response = self.client.post(
            reverse("post-share", args=[self.post.pk]),
            {"platform": "twitter"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["shares_count"], 1)
        self.assertEqual(response.data["share"]["platform"], "twitter")

    def test_share_without_platform(self):
        self.auth(self.user)
        response = self.client.post(
            reverse("post-share", args=[self.post.pk]), {}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_shares_count_in_post(self):
        Share.objects.create(user=self.user, post=self.post, platform="fb")
        Share.objects.create(user=self.user, post=self.post, platform="twitter")
        response = self.client.get(reverse("post-detail", args=[self.post.pk]))
        self.assertEqual(response.data["sharesCount"], 2)


# ─────────────────────────────────────────────────────────────────────────
#  Follow Tests
# ─────────────────────────────────────────────────────────────────────────

class FollowTests(SocialTestMixin, APITestCase):

    def setUp(self):
        self.alice = self.create_user("alice", "alice@example.com")
        self.bob = self.create_user("bob", "bob@example.com")

    def test_follow_user(self):
        self.auth(self.alice)
        response = self.client.post(reverse("follow-toggle", args=[self.bob.pk]))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["following"])
        self.assertEqual(response.data["followers_count"], 1)

    def test_unfollow_user(self):
        self.auth(self.alice)
        self.client.post(reverse("follow-toggle", args=[self.bob.pk]))
        response = self.client.post(reverse("follow-toggle", args=[self.bob.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["following"])
        self.assertEqual(response.data["followers_count"], 0)

    def test_cannot_follow_self(self):
        self.auth(self.alice)
        response = self.client.post(reverse("follow-toggle", args=[self.alice.pk]))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_followers_list(self):
        Follow.objects.create(follower=self.alice, following=self.bob)
        response = self.client.get(reverse("follower-list", args=[self.bob.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(
            response.data["results"][0]["follower"]["username"], "alice"
        )

    def test_following_list(self):
        Follow.objects.create(follower=self.alice, following=self.bob)
        response = self.client.get(reverse("following-list", args=[self.alice.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(
            response.data["results"][0]["following"]["username"], "bob"
        )

    def test_follow_creates_notification(self):
        self.auth(self.alice)
        self.client.post(reverse("follow-toggle", args=[self.bob.pk]))
        notif = Notification.objects.filter(user=self.bob, type="FOLLOW")
        self.assertEqual(notif.count(), 1)
        self.assertIn("alice", notif.first().message)


# ─────────────────────────────────────────────────────────────────────────
#  Feed Tests
# ─────────────────────────────────────────────────────────────────────────

class FeedTests(SocialTestMixin, APITestCase):

    def setUp(self):
        self.alice = self.create_user("alice", "alice@example.com")
        self.bob = self.create_user("bob", "bob@example.com")
        self.carol = self.create_user("carol", "carol@example.com")

    def test_feed_shows_followed_users_posts(self):
        Follow.objects.create(follower=self.alice, following=self.bob)
        Post.objects.create(author=self.bob, content="Bob's post")
        Post.objects.create(author=self.carol, content="Carol's post")

        self.auth(self.alice)
        response = self.client.get(reverse("user-feed"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["content"], "Bob's post")

    def test_feed_excludes_own_posts(self):
        Post.objects.create(author=self.alice, content="My own")
        self.auth(self.alice)
        response = self.client.get(reverse("user-feed"))
        self.assertEqual(response.data["count"], 0)

    def test_feed_requires_auth(self):
        response = self.client.get(reverse("user-feed"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
