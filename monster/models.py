from django.db import models
from monster.fields import JSONField

class Region(models.Model):
    key = models.CharField('Template Key',max_length=1000)
    template = models.TextField()
    data = JSONField()
    rendered = modes.TextField()