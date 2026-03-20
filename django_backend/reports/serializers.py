from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ('reporter', 'status', 'resolved_by', 'resolved_at')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['reporter'] = user
        return super().create(validated_data)
