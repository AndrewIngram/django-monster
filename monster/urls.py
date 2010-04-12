from django.conf.urls.defaults import *
from monster.piston_handlers import RegionAreaHandler
from piston.resource import Resource

region_resource = Resource(RegionAreaHandler)

urlpatterns = patterns('',
   url(r'^upload/$', 'monster.views.handle_upload'),                       
   url(r'^regions/(?P<id>\d+)/$', region_resource),
)