from django.urls import path
from .views import (
    CategoryListView, CategoryDetailView, CategoryCreateView, CategoryUpdateView, CategoryDeleteView,
    CategoryTreeView, CategoryByTypeView, CategoryImageView, CategoryImageDetailView,
    CategorySetPrimaryImageView, FeaturedCategoriesView
)

urlpatterns = [
    # Category CRUD
    path('', CategoryListView.as_view(), name='category-list'),
    path('create/', CategoryCreateView.as_view(), name='category-create'),
    path('tree/', CategoryTreeView.as_view(), name='category-tree'),
    path('featured/', FeaturedCategoriesView.as_view(), name='featured-categories'),
    path('type/<str:category_type>/', CategoryByTypeView.as_view(), name='categories-by-type'),
    path('<uuid:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('<uuid:pk>/update/', CategoryUpdateView.as_view(), name='category-update'),
    path('<uuid:pk>/delete/', CategoryDeleteView.as_view(), name='category-delete'),
    
    # Category images
    path('<uuid:category_id>/images/', CategoryImageView.as_view(), name='category-images'),
    path('<uuid:category_id>/images/<uuid:image_id>/set-primary/', 
         CategorySetPrimaryImageView.as_view(), name='category-set-primary-image'),
    path('images/<uuid:pk>/', CategoryImageDetailView.as_view(), name='category-image-detail'),
]
