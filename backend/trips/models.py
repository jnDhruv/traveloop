from django.db import models
from django.conf import settings
from cities.models import City
from activities.models import Activity
import uuid

class Trip(models.Model):
    user            = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
    title           = models.CharField(max_length=200)
    description     = models.TextField(blank=True)
    cover_image_url = models.URLField(blank=True)
    start_date      = models.DateField()
    end_date        = models.DateField()
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Status(models.TextChoices):
        PLANNED   = 'planned',   'Planned'
        ONGOING   = 'ongoing',   'Ongoing'
        COMPLETED = 'completed', 'Completed'

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)

    def __str__(self):
        return f"{self.title} ({self.user.email})"


class TripStop(models.Model):
    trip        = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    city        = models.ForeignKey(City, on_delete=models.PROTECT, related_name='trip_stops')
    start_date  = models.DateField()
    end_date    = models.DateField()
    order_index = models.PositiveIntegerField(default=0)
    budget      = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stop_notes  = models.TextField(blank=True)

    class Meta:
        ordering = ['order_index']

    def __str__(self):
        return f"{self.trip.title} → {self.city.name}"


class TripActivity(models.Model):
    trip_stop     = models.ForeignKey(TripStop, on_delete=models.CASCADE, related_name='trip_activities')
    activity      = models.ForeignKey(Activity, on_delete=models.PROTECT, related_name='trip_activities')
    activity_date = models.DateField()
    start_time    = models.TimeField(null=True, blank=True)
    cost_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    @property
    def cost(self):
        # use override if set, else fall back to base activity cost
        return self.cost_override if self.cost_override is not None else self.activity.cost

    def __str__(self):
        return f"{self.activity.title} on {self.activity_date}"


class Note(models.Model):
    trip      = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='notes')
    trip_stop = models.ForeignKey(TripStop, on_delete=models.CASCADE, related_name='notes_for_stop', null=True, blank=True)
    content   = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Note for {self.trip.title} ({self.created_at.date()})"


class SharedTrip(models.Model):
    trip        = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='shared')
    public_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    is_public   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shared: {self.trip.title}"