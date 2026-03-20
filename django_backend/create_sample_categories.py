#!/usr/bin/env python3
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookshell_backend.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from categories.models import Category, CategoryImage

def create_sample_categories():
    print("Creating sample categories...")
    
    # Root categories
    fiction = Category.objects.create(
        name="Fiction",
        description="Fictional stories and novels",
        type="BOTH",
        color="#FF6B6B",
        sort_order=1,
        is_featured=True
    )
    
    non_fiction = Category.objects.create(
        name="Non-Fiction",
        description="Real stories and educational content",
        type="BOTH",
        color="#4ECDC4",
        sort_order=2,
        is_featured=True
    )
    
    education = Category.objects.create(
        name="Education",
        description="Educational and academic materials",
        type="BOTH",
        color="#45B7D1",
        sort_order=3,
        is_featured=True
    )
    
    # Sub-categories for Fiction
    romance = Category.objects.create(
        name="Romance",
        description="Romantic stories and novels",
        type="BOTH",
        parent=fiction,
        color="#FF69B4",
        sort_order=1
    )
    
    thriller = Category.objects.create(
        name="Thriller",
        description="Suspenseful and exciting stories",
        type="BOTH",
        parent=fiction,
        color="#8B0000",
        sort_order=2
    )
    
    scifi = Category.objects.create(
        name="Science Fiction",
        description="Futuristic and sci-fi stories",
        type="BOTH",
        parent=fiction,
        color="#9400D3",
        sort_order=3
    )
    
    # Sub-categories for Non-Fiction
    biography = Category.objects.create(
        name="Biography",
        description="Life stories and biographies",
        type="BOTH",
        parent=non_fiction,
        color="#FFD700",
        sort_order=1
    )
    
    business = Category.objects.create(
        name="Business",
        description="Business and entrepreneurship",
        type="BOTH",
        parent=non_fiction,
        color="#32CD32",
        sort_order=2
    )
    
    self_help = Category.objects.create(
        name="Self-Help",
        description="Personal development and self-improvement",
        type="BOTH",
        parent=non_fiction,
        color="#FF8C00",
        sort_order=3
    )
    
    # Sub-categories for Education
    academic = Category.objects.create(
        name="Academic",
        description="Academic textbooks and materials",
        type="BOOK",
        parent=education,
        color="#800080",
        sort_order=1
    )
    
    children = Category.objects.create(
        name="Children",
        description="Children's books and stories",
        type="BOTH",
        parent=education,
        color="#FF69B4",
        sort_order=2
    )
    
    # Audiobook-specific category
    language_learning = Category.objects.create(
        name="Language Learning",
        description="Learn new languages through audiobooks",
        type="AUDIOBOOK",
        color="#00CED1",
        sort_order=4,
        is_featured=True
    )
    
    print(f"Created {Category.objects.count()} categories")
    
    # Add some sample images
    CategoryImage.objects.create(
        category=fiction,
        image_url="https://picsum.photos/seed/fiction/400/300.jpg",
        alt_text="Fiction books",
        is_primary=True
    )
    
    CategoryImage.objects.create(
        category=non_fiction,
        image_url="https://picsum.photos/seed/nonfiction/400/300.jpg",
        alt_text="Non-fiction books",
        is_primary=True
    )
    
    CategoryImage.objects.create(
        category=education,
        image_url="https://picsum.photos/seed/education/400/300.jpg",
        alt_text="Educational books",
        is_primary=True
    )
    
    print("Created sample category images")
    print("✓ Sample categories created successfully!")

if __name__ == '__main__':
    create_sample_categories()
