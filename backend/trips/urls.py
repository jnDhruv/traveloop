from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TripViewSet, TripStopViewSet,
    TripActivityViewSet, NoteViewSet,
    SharedTripPublicView
)

router = DefaultRouter()
router.register('',           TripViewSet,         basename='trip')
router.register('stops',      TripStopViewSet,      basename='tripstop')
router.register('activities', TripActivityViewSet,  basename='tripactivity')
router.register('notes',      NoteViewSet,          basename='note')

urlpatterns = [
    path('', include(router.urls)),
    path('shared/<uuid:token>/', SharedTripPublicView.as_view(), name='shared-trip'),
]