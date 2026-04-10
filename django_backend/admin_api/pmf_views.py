from django.db.models import Count, Q
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from datetime import timedelta
from calendar import monthrange

from django.contrib.auth import get_user_model
from reviews.models import Review
from users.models import UserActivity

User = get_user_model()


class PmfCohortService:
    """Service for calculating PMF (Product-Market Fit) cohort data"""
    
    PMF_TARGET = 75  # 75% activation target
    
    @staticmethod
    def get_cohort_data(max_weeks=12):
        """Get full cohort heatmap data for PMF analysis"""
        now = timezone.now()
        
        # Get earliest user signup
        first_user = User.objects.order_by('date_joined').first()
        if not first_user:
            return {
                'pmf_target': PmfCohortService.PMF_TARGET,
                'cohorts': []
            }
        
        first_signup = first_user.date_joined
        first_cohort_start = PmfCohortService._start_of_week(first_signup)
        
        cohorts = []
        current_cohort_start = first_cohort_start
        
        # Build cohorts from first signup up to now
        while current_cohort_start <= now and len(cohorts) < 52:
            cohort_end = current_cohort_start + timedelta(days=6)
            
            # Users that signed up in this cohort week
            cohort_users = User.objects.filter(
                date_joined__gte=current_cohort_start,
                date_joined__lte=cohort_end
            )
            
            total_users = cohort_users.count()
            
            if total_users > 0:
                weeks = []
                
                # Track activation for each relative week (0-24)
                for relative_week in range(max_weeks):
                    week_start = current_cohort_start + timedelta(weeks=relative_week)
                    week_end = week_start + timedelta(days=6)
                    
                    # Users from this cohort who activated in this relative week
                    # Activation = played audio (wrote a review)
                    activated = cohort_users.filter(
                        reviews__created_at__gte=week_start,
                        reviews__created_at__lte=week_end,
                        reviews__audiobook__isnull=False
                    ).distinct().count()
                    
                    percentage = (activated / total_users * 100) if total_users > 0 else 0
                    
                    weeks.append({
                        'relative_week': relative_week,
                        'active_users': activated,
                        'total_users': total_users,
                        'percentage': round(percentage, 1) if activated > 0 else None,
                    })
                
                cohort_week = current_cohort_start.strftime('%Y-%m-%d')
                cohort_label = current_cohort_start.strftime('W%W %Y')
                
                cohorts.append({
                    'cohort_week': cohort_week,
                    'cohort_label': cohort_label,
                    'total_users': total_users,
                    'weeks': weeks,
                })
            
            current_cohort_start += timedelta(weeks=1)
        
        return {
            'pmf_target': PmfCohortService.PMF_TARGET,
            'cohorts': cohorts,
        }
    
    @staticmethod
    def get_pmf_score():
        """Get PMF score for the latest completed cohort (7 days elapsed)"""
        now = timezone.now()
        
        # Latest cohort that has had 7 full days
        latest_cohort_start = PmfCohortService._start_of_week(now - timedelta(days=7))
        
        # If the latest cohort week hasn't finished its 7-day window, go back one more week
        cohort_end = latest_cohort_start + timedelta(days=6)
        if cohort_end + timedelta(days=7) > now:
            latest_cohort_start -= timedelta(weeks=1)
        
        # Get users from this cohort
        cohort_end = latest_cohort_start + timedelta(days=6)
        cohort_users = User.objects.filter(
            date_joined__gte=latest_cohort_start,
            date_joined__lte=cohort_end
        )
        
        total_users = cohort_users.count()
        
        # Users who activated in first 7 days (played audiobook)
        activation_threshold = latest_cohort_start + timedelta(days=7)
        activated_users = cohort_users.filter(
            reviews__created_at__lte=activation_threshold,
            reviews__audiobook__isnull=False
        ).distinct().count()
        
        score = (activated_users / total_users * 100) if total_users > 0 else 0
        target_met = score >= PmfCohortService.PMF_TARGET if total_users > 0 else None
        
        cohort_key = latest_cohort_start.strftime('%Y-%m-%d')
        
        return {
            'pmf_target': PmfCohortService.PMF_TARGET,
            'latest_cohort': cohort_key,
            'total_users': total_users,
            'users_with_audio_7d': activated_users if activated_users > 0 else None,
            'score': round(score, 2) if total_users > 0 else None,
            'target_met': target_met,
        }
    
    @staticmethod
    def _start_of_week(dt):
        """Get the start of the week (Monday) for a given datetime"""
        # Monday is 0 in weekday()
        days_ago = dt.weekday()
        start = dt - timedelta(days=days_ago)
        return start.replace(hour=0, minute=0, second=0, microsecond=0)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pmf_cohorts(request):
    """Get PMF cohort data for heatmap analysis"""
    max_weeks = request.query_params.get('weeks', 12)
    try:
        max_weeks = max(1, min(int(max_weeks), 52))
    except (ValueError, TypeError):
        max_weeks = 12
    
    data = PmfCohortService.get_cohort_data(max_weeks)
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pmf_score(request):
    """Get current PMF score"""
    data = PmfCohortService.get_pmf_score()
    return Response(data)
