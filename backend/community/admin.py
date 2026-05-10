from django.contrib import admin
from .models import CommunityPost

@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display  = ['user', 'trip', 'created_at']
    search_fields = ['caption', 'user__email']