from rest_framework import viewsets, permissions
from .models import PackingItem
from .serializers import PackingItemSerializer

class PackingItemViewSet(viewsets.ModelViewSet):
    serializer_class   = PackingItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PackingItem.objects.filter(trip__user=self.request.user)