from rest_framework import serializers
from .models import PackingItem

class PackingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackingItem
        fields = '__all__'
        read_only_fields = ['id']