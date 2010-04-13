from django.conf import settings
from django.http import HttpResponse
from .util.storages import DefaultStorage

def handle_uploaded_file(storage,f,type):
    
    return storage.save('monster/'+f.name,f)

def handle_upload(request):
    """
    Handles an AJAX file upload, returns the path/filename of the saved file
    """
    storage = DefaultStorage()

    if request.method=='POST' and request.FILES:
        f = request.FILES.values()[0]
        name = settings.MEDIA_URL + handle_uploaded_file(storage,f,'')
    else:
        name = False;
        
    data = """
        {
         error: '',
         filename: '%s',
        }
    """ % (name)
            
    return HttpResponse(data)