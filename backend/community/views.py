from rest_framework import viewsets, permissions
from .models import CommunityPost
from .serializers import CommunityPostSerializer

class CommunityPostViewSet(viewsets.ModelViewSet):
    serializer_class   = CommunityPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CommunityPost.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)