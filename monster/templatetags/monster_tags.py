from django.template import Library, Node, TemplateSyntaxError, Variable, VariableDoesNotExist
from django.template import resolve_variable
from monster.models import Region

register = Library()

class RegionNode(Node):
    def __init__(self, nodelist, params):
        self.nodelist = nodelist
        self.params = params

    def render(self, context):
        
        try:
            request = context['request']
        except KeyError, e:
            print e
        
        key = u':'.join([resolve_variable(var, context) for var in self.params])        

        template = self.nodelist.render(context)
        
        try:
            area = Region.objects.get(key=key)
        except:
            if request.user.is_staff:
                area = Region(key=key,template=template,rendered=template)
                area.save()
            else:
                return template
        
        # If the user is staff, allow update the request to know about it, later our middleware will hack the editor code into the response
        # TODO Proper permissions, not all staff should be able to do this
        if request.user.is_staff:
            request.monster_enabled = True
            
            reload_str = '<div style="display:none;" class="monster-reload" m:id="%s" m:key="%s">%s</div>' % (area.id, area.key, template)
            visible_str = '<div class="monster-region" m:id="%s" m:key="%s">%s</div>' % (area.id, area.key, area.rendered or area.template)
            
            return '%s %s' % (reload_str, visible_str)
        else:
            return area.rendered or area.template

def do_region(parser, token):
    nodelist = parser.parse(('endmonster',))
    parser.delete_first_token()
    tokens = token.contents.split()
    if len(tokens) < 2:
        raise TemplateSyntaxError(u"'%r' tag requires at least 1 arguments." % tokens[0])
    return RegionNode(nodelist, tokens[1:])

register.tag('monster_region', do_region)