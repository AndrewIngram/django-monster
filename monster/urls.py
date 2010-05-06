from django.conf.urls.defaults import *
from monster.piston_handlers import RegionAreaHandler, TimelineRegionAreaHandler, TimelineRegionKeyHandler
from piston.resource import Resource

region_resource = Resource(RegionAreaHandler)
timelineregion_resource = Resource(TimelineRegionAreaHandler)
timelineregionkey_resource = Resource(TimelineRegionKeyHandler)

urlpatterns = patterns('',
   url(r'^upload/$', 'monster.views.handle_upload'),                       
   url(r'^regions/(?P<id>\d+)/$', region_resource),
   url(r'^timelineregions/(?P<id>\d+)/$', timelineregion_resource),
   url(r'^timelineregions/(?P<id>\d+)/timeline/$', timelineregionkey_resource),  
)