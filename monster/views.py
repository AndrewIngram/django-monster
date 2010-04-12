from django.conf import settings
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from .util.storages import CAFTPStorage

def handle_uploaded_file(storage,f,type):
    
    return storage.save('monstertest/' + f.name,f)

def handle_upload(request):
    """
    Handles an AJAX file upload, returns the path/filename of the saved file
    """
    storage = CAFTPStorage(location=settings.FTP_STORAGE_LOCATION,base_url=settings.FTP_MEDIA_URL)
    
    if request.method=='POST' and request.FILES:
        f = request.FILES[u'editor-image-file']
        name = settings.FTP_MEDIA_URL + handle_uploaded_file(storage,f,'')
    else:
        name = False;
        
    data = """
        {
         error: '',
         filename: '%s',
        }
    """ % (name)
            
    return HttpResponse(data)