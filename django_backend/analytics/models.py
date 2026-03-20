from django.db import models
import uuid

class Analytics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    metric = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=15, decimal_places=2)
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', 'metric']

    def __str__(self):
        return f"{self.date} - {self.metric}: {self.value}"
