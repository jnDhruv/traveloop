from rest_framework import serializers
from .models import CommunityPost
from users.serializers import UserSerializer

class CommunityPostSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = CommunityPost
        fields = ['id', 'user', 'user_detail', 'trip', 'caption', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']