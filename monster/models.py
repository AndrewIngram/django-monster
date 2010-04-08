from django.db import models
from monster.fields import JSONField

class RegionData(models.Model):
    key = models.CharField('Template Key',max_length=1000,db_index=True)
    template = models.TextField()
    data = JSONField()
    rendered = models.TextField()    
    
    class Meta:
        abstract = True

class Region(RegionData):
    pass
    
class TimelineRegion(RegionData):
    start_date = models.DateField(db_index=True)
    approved = models.BooleanField(db_index=True)