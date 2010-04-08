from django.conf import settings
from django.template.loader import render_to_string
from django.utils.encoding import smart_unicode
from monster.models import Region

def replace_insensitive(string, target, replacement):
    """
    Similar to string.replace() but is case insensitive
    Code borrowed from: http://forums.devshed.com/python-programming-11/case-insensitive-string-replace-490921.html
    """
    no_case = string.lower()
    index = no_case.rfind(target.lower())
    if index >= 0:
        return string[:index] + replacement + string[index + len(target):]
    else: # no results so return the original string
        return string

class MonsterMiddleware():
    
    def process_request(self, request):
        request.monster_enabled = False

    def process_response(self, request, response):
        try:
            getattr(request,'monster_enabled')
        except:
            return response        
        
        if request.monster_enabled:
            data = {
                'MONSTER_MEDIA_URL': settings.MONSTER_MEDIA_URL,
            }
                
            try:
                toolbar = render_to_string('monster/toolbar.html', data)
                response.content = replace_insensitive(smart_unicode(response.content), u'</body>', smart_unicode(toolbar + u'</body>'))
            except Exception, e:
                return response                          
        return response