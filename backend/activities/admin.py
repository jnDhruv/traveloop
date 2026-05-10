from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display  = ['title', 'city', 'category', 'cost', 'duration', 'rating']
    search_fields = ['title', 'description']
    list_filter   = ['category', 'city']