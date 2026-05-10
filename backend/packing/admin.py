from django.contrib import admin
from .models import PackingItem

@admin.register(PackingItem)
class PackingItemAdmin(admin.ModelAdmin):
    list_display  = ['item_name', 'trip', 'category', 'is_packed']
    list_filter   = ['category', 'is_packed']
    search_fields = ['item_name', 'trip__title']