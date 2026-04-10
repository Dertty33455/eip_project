from audiobooks.models import Audiobook, AudioChapter
from datetime import datetime, date


def seed_audiobooks():
    """Seed demo audiobooks"""
    
    demo_audiobooks = [
        {
            'title': "Contes et Légendes d'Afrique",
            'author': 'Tradition Orale',
            'narrator': 'Mamadou Konaté',
            'description': 'Une collection de contes traditionnels africains, racontés avec passion.',
            'cover_image': 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400',
            'duration_minutes': 120,
            'language': 'FR',
            'genre': 'HISTORY',
            'chapter_count': 4,
            'file_size': 104857600,  # 100MB
            'audio_file_url': 'https://example.com/contes-et-legendes-afrique.mp3',
            'price': 5000,
            'is_premium': True,
        },
        {
            'title': 'Les Secrets du Leadership Africain',
            'author': 'Dr. Kwame Asante',
            'narrator': 'Issa Touré',
            'description': 'Découvrez les principes de leadership inspirés des grandes figures africaines.',
            'cover_image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            'duration_minutes': 180,
            'language': 'FR',
            'genre': 'BUSINESS',
            'chapter_count': 6,
            'file_size': 157286400,  # 150MB
            'audio_file_url': 'https://example.com/secrets-leadership-africain.mp3',
            'price': 7500,
            'is_premium': True,
        },
        {
            'title': 'Méditation et Sagesse Ubuntu',
            'author': 'Nadia Mbeki',
            'narrator': 'Nadia Mbeki',
            'description': 'Un guide audio pour la méditation basée sur la philosophie Ubuntu.',
            'cover_image': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
            'duration_minutes': 90,
            'language': 'FR',
            'genre': 'SELF_HELP',
            'chapter_count': 3,
            'file_size': 78643200,  # 75MB
            'audio_file_url': 'https://example.com/meditation-sagesse-ubuntu.mp3',
            'price': 4500,
            'is_free': True,
        },
    ]

    created_count = 0
    for audio_data in demo_audiobooks:
        chapter_count = audio_data.pop('chapter_count')
        
        audiobook, created = Audiobook.objects.get_or_create(
            title=audio_data['title'],
            author=audio_data['author'],
            defaults={
                **audio_data,
                'published_date': date.today(),
            }
        )
        
        if created:
            created_count += 1
            # Create chapters
            minutes_per_chapter = audio_data['duration_minutes'] // chapter_count
            for i in range(1, chapter_count + 1):
                AudioChapter.objects.create(
                    audiobook=audiobook,
                    title=f"Chapitre {i}",
                    chapter_number=i,
                    duration_minutes=minutes_per_chapter,
                    audio_url=f"/audio/sample-chapter-{i}.mp3",
                    is_free=(i == 1),
                )

    print(f"✓ Seeded {created_count} audiobooks with chapters")
