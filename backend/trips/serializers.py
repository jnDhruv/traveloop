from rest_framework import serializers
from .models import Trip, TripStop, TripActivity, Note, SharedTrip
from cities.serializers import CitySerializer
from activities.serializers import ActivitySerializer

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class TripActivitySerializer(serializers.ModelSerializer):
    activity_detail = ActivitySerializer(source='activity', read_only=True)
    cost            = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = TripActivity
        fields = ['id', 'trip_stop', 'activity', 'activity_detail', 'activity_date', 'start_time', 'cost_override', 'cost']

class TripStopSerializer(serializers.ModelSerializer):
    city_detail     = CitySerializer(source='city', read_only=True)
    trip_activities = TripActivitySerializer(many=True, read_only=True)

    class Meta:
        model = TripStop
        fields = ['id', 'trip', 'city', 'city_detail', 'start_date', 'end_date', 'order_index', 'budget', 'stop_notes', 'trip_activities']

class SharedTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedTrip
        fields = ['id', 'public_token', 'is_public', 'created_at']
        read_only_fields = ['id', 'public_token', 'created_at']

class TripSerializer(serializers.ModelSerializer):
    stops  = TripStopSerializer(many=True, read_only=True)
    notes  = NoteSerializer(many=True, read_only=True)
    shared = SharedTripSerializer(read_only=True)

    class Meta:
        model = Trip
        fields = ['id', 'user', 'title', 'description', 'cover_image_url', 'start_date', 'end_date', 'status', 'created_at', 'stops', 'notes', 'shared']
        read_only_fields = ['id', 'user', 'created_at']