from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.utils.functional import LazyObject
from django.utils.importlib import import_module

try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO

"""
This is all copied directly from Django so that we get our own version of DefaultStorage that's specific to monster
"""    
def get_storage_class(import_path=None):
    if import_path is None:
        import_path = settings.MONSTER_STORAGE
    try:
        dot = import_path.rindex('.')
    except ValueError:
        raise ImproperlyConfigured("%s isn't a storage module." % import_path)
    module, classname = import_path[:dot], import_path[dot+1:]
    try:
        mod = import_module(module)
    except ImportError, e:
        raise ImproperlyConfigured('Error importing storage module %s: "%s"' % (module, e))
    try:
        return getattr(mod, classname)
    except AttributeError:
        raise ImproperlyConfigured('Storage module "%s" does not define a "%s" class.' % (module, classname))

class DefaultStorage(LazyObject):
    def _setup(self):
        self._wrapped = get_storage_class()()

default_storage = DefaultStorage()