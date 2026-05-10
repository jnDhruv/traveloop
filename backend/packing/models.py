from django.db import models
from trips.models import Trip

class PackingItem(models.Model):
    class Category(models.TextChoices):
        CLOTHING     = 'clothing',     'Clothing'
        DOCUMENTS    = 'documents',    'Documents'
        ELECTRONICS  = 'electronics',  'Electronics'
        TOILETRIES   = 'toiletries',   'Toiletries'
        MISCELLANEOUS = 'miscellaneous', 'Miscellaneous'

    trip      = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='packing_items')
    item_name = models.CharField(max_length=200)
    category  = models.CharField(max_length=20, choices=Category.choices, default=Category.MISCELLANEOUS)
    is_packed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.item_name} ({'packed' if self.is_packed else 'unpacked'})"