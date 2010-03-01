from django.db import models
from monster.fields import RegionField

class Page(models.Model):
    title = models.CharField(max_length=250)
    content = RegionField()