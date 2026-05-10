from django.db import models
from cities.models import City

class Activity(models.Model):
    class Category(models.TextChoices):
        PHYSICAL      = 'physical',      'Physical'
        ACCOMMODATION = 'accommodation', 'Accommodation'
        DINING        = 'dining',        'Dining'
        LANDMARK      = 'landmark',      'Landmark'

    city        = models.ForeignKey(City, on_delete=models.CASCADE, related_name='activities')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category    = models.CharField(max_length=20, choices=Category.choices)
    cost        = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration    = models.PositiveIntegerField(help_text='Duration in minutes')
    image_url   = models.URLField(blank=True)
    rating      = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    class Meta:
        verbose_name_plural = 'activities'

    def __str__(self):
        return f"{self.title} ({self.city.name})"