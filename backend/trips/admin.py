from django.contrib import admin
from .models import Trip, TripStop, TripActivity, Note, SharedTrip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display  = ['title', 'user', 'status', 'start_date', 'end_date', 'created_at']
    search_fields = ['title', 'user__email']
    list_filter   = ['status']

@admin.register(TripStop)
class TripStopAdmin(admin.ModelAdmin):
    list_display  = ['trip', 'city', 'start_date', 'end_date', 'order_index', 'budget']
    search_fields = ['trip__title', 'city__name']

@admin.register(TripActivity)
class TripActivityAdmin(admin.ModelAdmin):
    list_display  = ['activity', 'trip_stop', 'activity_date', 'start_time', 'cost_override']
    search_fields = ['activity__title']

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display  = ['trip', 'trip_stop', 'created_at']
    search_fields = ['content', 'trip__title']

@admin.register(SharedTrip)
class SharedTripAdmin(admin.ModelAdmin):
    list_display  = ['trip', 'public_token', 'is_public', 'created_at']