from django.urls import path
from . import pmf_views

urlpatterns = [
    path('score', pmf_views.pmf_score, name='pmf_score'),
    path('cohorts', pmf_views.pmf_cohorts, name='pmf_cohorts'),
]
