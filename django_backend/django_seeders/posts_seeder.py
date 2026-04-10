from django.contrib.auth import get_user_model
from social.models import Post

User = get_user_model()


def seed_posts():
    """Seed demo social posts"""
    users = list(User.objects.all()[:3])

    if not users:
        print("⚠ Cannot seed posts: no users found")
        return

    demo_posts = [
        {
            'type': 'REVIEW',
            'content': '📚 Je viens de terminer "Une Si Longue Lettre" de Mariama Bâ et je suis bouleversée! Ce roman explore avec tant de profondeur la condition féminine en Afrique. Un chef-d\'œuvre intemporel que tout le monde devrait lire. ⭐⭐⭐⭐⭐',
            'rating': 5,
        },
        {
            'type': 'RECOMMENDATION',
            'content': '🌟 Recommandation du jour: Si vous cherchez de l\'inspiration entrepreneuriale, lisez "Réfléchissez et Devenez Riche" de Napoleon Hill. Un livre qui change les perspectives!',
        },
        {
            'type': 'TEXT',
            'content': '💡 Question à la communauté: Quels sont vos auteurs africains préférés? Je cherche à découvrir de nouvelles voix littéraires du continent. Partagez vos suggestions! 🌍📖',
        },
    ]

    created_count = 0
    for idx, post_data in enumerate(demo_posts):
        user = users[idx % len(users)]
        
        post, created = Post.objects.get_or_create(
            content=post_data['content'],
            author=user,
            defaults={
                'type': post_data.get('type', 'TEXT'),
            }
        )
        
        if created:
            created_count += 1

    print(f"✓ Seeded {created_count} social posts")
