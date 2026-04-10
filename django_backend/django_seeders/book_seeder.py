from django.contrib.auth import get_user_model
from books.models import Book
from categories.models import Category

User = get_user_model()


def seed_books():
    """Seed demo books from all book seeders"""
    
    sellers_list = list(User.objects.filter(role__in=['SELLER', 'ADMIN']))
    categories_map = {cat.name: cat for cat in Category.objects.all()}

    if not sellers_list or not categories_map:
        print("⚠ Cannot seed books: missing sellers or categories")
        return

    books_data = [
        # BookSeeder books
        {
            'title': 'L\'Énigme de la Méduse',
            'author': 'Ahmad Diop',
            'isbn': '978-2-123-45678-9',
            'description': 'Un thriller captivant se déroulant à Dakar.',
            'price': 8500.00,
            'original_price': 9500.00,
            'condition': 'LIKE_NEW',
            'status': 'AVAILABLE',
            'pages': 320,
            'language': 'FR',
            'published_date': '2023-01-01',
            'genre': 'Roman',
            'seller_idx': 0,
            'cover_image': 'https://picsum.photos/seed/book1/400/600.jpg',
        },
        {
            'title': 'Futur Digital',
            'author': 'Fatou Ba',
            'isbn': '978-2-456-78912-3',
            'description': 'Guide complet sur la transformation digitale en Afrique.',
            'price': 12000.00,
            'original_price': 15000.00,
            'condition': 'NEW',
            'status': 'AVAILABLE',
            'pages': 450,
            'language': 'FR',
            'published_date': '2024-01-01',
            'genre': 'Business & Entrepreneuriat',
            'seller_idx': 1,
            'cover_image': 'https://picsum.photos/seed/book2/400/600.jpg',
        },
        {
            'title': 'Étoiles du Sahel',
            'author': 'Ahmad Diop',
            'isbn': '978-2-789-01234-5',
            'description': 'Recueil de poésies sur la vie au Sahel.',
            'price': 6500.00,
            'condition': 'VERY_GOOD',
            'status': 'AVAILABLE',
            'pages': 180,
            'language': 'FR',
            'published_date': '2022-01-01',
            'genre': 'Roman',
            'seller_idx': 0,
            'cover_image': 'https://picsum.photos/seed/book3/400/600.jpg',
        },
        {
            'title': 'Le Code du Succès',
            'author': 'Fatou Ba',
            'isbn': '978-2-345-67890-1',
            'description': 'Stratégies d\'entrepreneuriat pour les jeunes Africains.',
            'price': 9500.00,
            'original_price': 12000.00,
            'condition': 'GOOD',
            'status': 'AVAILABLE',
            'pages': 280,
            'language': 'FR',
            'published_date': '2023-01-01',
            'genre': 'Business & Entrepreneuriat',
            'seller_idx': 1,
            'cover_image': 'https://picsum.photos/seed/book4/400/600.jpg',
        },
        {
            'title': 'Mystères d\'Ancienne',
            'author': 'Ahmad Diop',
            'isbn': '978-2-567-89012-4',
            'description': 'Les secrets des royaumes africains anciens.',
            'price': 11000.00,
            'condition': 'LIKE_NEW',
            'status': 'AVAILABLE',
            'pages': 420,
            'language': 'FR',
            'published_date': '2024-01-01',
            'genre': 'Histoire & Culture',
            'seller_idx': 0,
            'cover_image': 'https://picsum.photos/seed/book5/400/600.jpg',
        },
        # AfricanLiteratureBooksSeeder
        {
            'title': 'Une Si Longue Lettre',
            'author': 'Mariama Bâ',
            'description': 'Un classique de la littérature africaine. Roman épistolaire qui explore la condition féminine au Sénégal.',
            'price': 5500,
            'condition': 'VERY_GOOD',
            'language': 'FR',
            'published_date': '1979-01-01',
            'pages': 165,
            'genre': 'Littérature Africaine',
            'seller_idx': 0,
            'cover_image': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        },
        {
            'title': 'Les Soleils des Indépendances',
            'author': 'Ahmadou Kourouma',
            'description': "Chef-d'œuvre de la littérature africaine francophone, ce roman raconte la déchéance d'un prince malinké.",
            'price': 6000,
            'condition': 'GOOD',
            'language': 'FR',
            'published_date': '1968-01-01',
            'pages': 196,
            'genre': 'Littérature Africaine',
            'seller_idx': 1,
            'cover_image': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        },
        {
            'title': "L'Enfant Noir",
            'author': 'Camara Laye',
            'description': "Autobiographie poétique d'un enfant guinéen, un récit initiatique touchant.",
            'price': 4500,
            'condition': 'LIKE_NEW',
            'language': 'FR',
            'published_date': '1953-01-01',
            'pages': 224,
            'genre': 'Littérature Africaine',
            'seller_idx': 0,
            'cover_image': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
        },
        {
            'title': 'Chaka',
            'author': 'Léopold Sédar Senghor',
            'description': 'Épopée historique du roi zoulou Chaka racontée en vers libres.',
            'price': 5500,
            'condition': 'VERY_GOOD',
            'language': 'FR',
            'published_date': '1956-01-01',
            'pages': 208,
            'genre': 'Littérature Africaine',
            'seller_idx': 1,
            'cover_image': 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        },
        {
            'title': 'Tout s\'écoule',
            'author': 'Mongo Beti',
            'description': 'Roman de dénonciation du colonialisme français en Afrique de l\'Ouest.',
            'price': 5000,
            'condition': 'GOOD',
            'language': 'FR',
            'published_date': '1971-01-01',
            'pages': 288,
            'genre': 'Littérature Africaine',
            'seller_idx': 0,
            'cover_image': 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        },
        # BusinessBooksSeeder
        {
            'title': 'Père Riche, Père Pauvre',
            'author': 'Robert Kiyosaki',
            'description': "Le livre qui a changé la vision de millions de personnes sur l'argent et l'investissement.",
            'price': 8000,
            'condition': 'NEW',
            'language': 'FR',
            'published_date': '1997-01-01',
            'pages': 336,
            'genre': 'Business & Entrepreneuriat',
            'seller_idx': 1,
            'cover_image': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
        },
        {
            'title': "L'Alchimiste",
            'author': 'Paulo Coelho',
            'description': "Un guide inspirant vers le succès et l'accomplissement personnel.",
            'price': 6500,
            'condition': 'LIKE_NEW',
            'language': 'FR',
            'published_date': '1988-01-01',
            'pages': 224,
            'genre': 'Développement Personnel',
            'seller_idx': 0,
            'cover_image': 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        },
        {
            'title': 'Sapiens',
            'author': 'Yuval Noah Harari',
            'description': "Une brève histoire de l'humanité.",
            'price': 9500,
            'condition': 'NEW',
            'language': 'FR',
            'published_date': '2011-01-01',
            'pages': 541,
            'genre': 'Histoire & Culture',
            'seller_idx': 1,
            'cover_image': 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        },
        {
            'title': 'Le Pouvoir des Habitudes',
            'author': 'Charles Duhigg',
            'description': 'Comment mettre en place les bonnes habitudes pour transformer sa vie.',
            'price': 7500,
            'condition': 'VERY_GOOD',
            'language': 'FR',
            'published_date': '2012-01-01',
            'pages': 371,
            'genre': 'Développement Personnel',
            'seller_idx': 0,
            'cover_image': 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        },
        {
            'title': 'Réfléchissez et Devenez Riche',
            'author': 'Napoleon Hill',
            'description': 'Les principes fondamentaux du succès et de la richesse.',
            'price': 8500,
            'condition': 'GOOD',
            'language': 'FR',
            'published_date': '1937-01-01',
            'pages': 320,
            'genre': 'Business & Entrepreneuriat',
            'seller_idx': 1,
            'cover_image': 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        },
    ]

    created_count = 0
    for idx, book_data in enumerate(books_data):
        genre_name = book_data.pop('genre')
        seller_idx = book_data.pop('seller_idx')
        
        # Get category by name
        category = categories_map.get(genre_name)
        if not category:
            print(f"⚠ Category {genre_name} not found for {book_data['title']}")
            continue
        
        # Get seller
        seller = sellers_list[seller_idx % len(sellers_list)]
        
        # Create book
        book, created = Book.objects.get_or_create(
            isbn=book_data.get('isbn', f'ISBN-{idx}'),
            defaults={
                'title': book_data['title'],
                'author': book_data['author'],
                'description': book_data.get('description', ''),
                'price': book_data['price'],
                'original_price': book_data.get('original_price'),
                'condition': book_data.get('condition', 'GOOD'),
                'status': book_data.get('status', 'AVAILABLE'),
                'pages': book_data.get('pages'),
                'language': book_data.get('language', 'FR'),
                'published_date': book_data.get('published_date'),
                'genre': category,
                'seller': seller,
                'cover_image': book_data.get('cover_image', ''),
            }
        )
        if created:
            created_count += 1

    print(f"✓ Seeded {created_count} books")
