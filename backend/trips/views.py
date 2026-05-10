from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Trip, TripStop, TripActivity, Note, SharedTrip
from .serializers import (
    TripSerializer, TripStopSerializer,
    TripActivitySerializer, NoteSerializer, SharedTripSerializer
)

class TripViewSet(viewsets.ModelViewSet):
    serializer_class   = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        trip = self.get_object()
        shared, created = SharedTrip.objects.get_or_create(trip=trip)
        return Response(SharedTripSerializer(shared).data)


class TripStopViewSet(viewsets.ModelViewSet):
    serializer_class   = TripStopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TripStop.objects.filter(trip__user=self.request.user)


class TripActivityViewSet(viewsets.ModelViewSet):
    serializer_class   = TripActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TripActivity.objects.filter(trip_stop__trip__user=self.request.user)


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class   = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(trip__user=self.request.user)


class SharedTripPublicView(generics.RetrieveAPIView):
    serializer_class   = TripSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        token = self.kwargs['token']
        shared = get_object_or_404(SharedTrip, public_token=token, is_public=True)
        return shared.trip