from rest_framework import viewsets, permissions, filters
from .models import City
from .serializers import CitySerializer

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['name', 'country']