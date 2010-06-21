from piston.handler import BaseHandler
from monster.models import Region, TimelineRegion
import datetime
from django.conf import settings

class RegionAreaHandler(BaseHandler):
    allowed_methods = ('GET','PUT',)
    fields = ('data','template','rendered',)
    model = Region
    
class TimelineRegionAreaHandler(BaseHandler):
    allowed_methods = ('GET','PUT',)
    fields = ('data','template','rendered','start_date','approved',)
    model = TimelineRegion
    
class TimelineRegionKeyHandler(BaseHandler):
    allowed_methods = ('GET',)
    fields = ('data','template','rendered','start_date','approved',)
    
    def read(self,id):
        obj = TimelineRegion.objects.get(id=id)
        key = obj.key
        
        return TimelineRegion.objects.filter(key=key)    
    