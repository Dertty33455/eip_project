from categories.models import Category


def seed_categories():
    """Seed demo categories"""
    demo_categories = [
        {
            'name': 'Roman',
            'description': 'Romans et fiction',
            'icon': '📖'
        },
        {
            'name': 'Littérature Africaine',
            'description': 'Œuvres d\'auteurs africains',
            'icon': '🌍'
        },
        {
            'name': 'Business & Entrepreneuriat',
            'description': 'Livres sur les affaires et l\'entrepreneuriat',
            'icon': '💼'
        },
        {
            'name': 'Développement Personnel',
            'description': 'Croissance personnelle et motivation',
            'icon': '🧠'
        },
        {
            'name': 'Histoire & Culture',
            'description': 'Histoire et patrimoine culturel',
            'icon': '🏛️'
        },
        {
            'name': 'Sciences & Technologie',
            'description': 'Sciences, tech et innovation',
            'icon': '🔬'
        },
        {
            'name': 'Éducation & Académique',
            'description': 'Manuels et ressources éducatives',
            'icon': '🎓'
        },
        {
            'name': 'Jeunesse & BD',
            'description': 'Livres jeunesse et bandes dessinées',
            'icon': '🦸'
        },
        {
            'name': 'Religion & Spiritualité',
            'description': 'Ouvrages religieux et spirituels',
            'icon': '🕊️'
        },
        {
            'name': 'Art & Photographie',
            'description': 'Beaux-arts et photographie',
            'icon': '🎨'
        },
        {
            'name': 'Cuisine Africaine',
            'description': 'Recettes et gastronomie africaine',
            'icon': '🍲'
        },
        {
            'name': 'Santé & Bien-être',
            'description': 'Santé, médecine et bien-être',
            'icon': '💚'
        },
    ]

    for category_data in demo_categories:
        Category.objects.get_or_create(
            name=category_data['name'],
            defaults={
                'description': category_data.get('description', ''),
                'icon': category_data.get('icon', ''),
                'type': 'BOTH',
            }
        )

    print(f"✓ Seeded {len(demo_categories)} categories")
