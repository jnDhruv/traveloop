from rest_framework import viewsets, permissions, filters
from .models import Activity
from .serializers import ActivitySerializer

class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['title', 'description', 'category']

    def get_queryset(self):
        qs      = super().get_queryset()
        city_id = self.request.query_params.get('city')
        category = self.request.query_params.get('category')
        if city_id:
            qs = qs.filter(city_id=city_id)
        if category:
            qs = qs.filter(category=category)
        return qs