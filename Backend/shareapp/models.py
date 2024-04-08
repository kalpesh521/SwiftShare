from django.db import models
import uuid
import os
 
# This class represents a Folder model with a unique identifier (uid) and a creation date.

class Folder(models.Model):
    uid= models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    created_at=models.DateField(auto_now=True)
    def __str__(self):
        return self.uid
# This function generates the upload path for a file based on the associated folder's uid.

def get_upload_path(instance,filename):
    return os.path.join(str(instance.folder.uid),filename) 

print(get_upload_path)

# This class represents a File model with a foreign key relationship to a Folder, a file field, and a creation date.
class Files(models.Model):
    folder=models.ForeignKey(Folder,on_delete=models.CASCADE)
    file= models.FileField(upload_to=get_upload_path)
    created_at=models.DateField(auto_now=True)
    
    def __str__(self):
        return self.folder
        