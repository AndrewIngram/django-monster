from piston.handler import BaseHandler
from monster.models import Region
import datetime
from django.conf import settings

class RegionAreaHandler(BaseHandler):
    allowed_methods = ('GET','PUT',)
    fields = ('data','template','rendered',)
    model = Region