from django.db import models
from django.conf import settings
from trips.models import Trip

class CommunityPost(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    trip       = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='posts', null=True, blank=True)
    caption    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Post by {self.user.email} ({self.created_at.date()})"