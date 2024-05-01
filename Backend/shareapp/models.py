from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
import os
 
class CustomUser(AbstractUser):
     email = models.EmailField(unique=True)
     USERNAME_FIELD ="email"
     REQUIRED_FIELDS = ["username"]
     
     def __str__(self) -> str:
         return self.email
  

class Folder(models.Model):
    uid= models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    created_at=models.DateField(auto_now=True)
     
# This function generates the upload path for a file based on the associated folder's uid.

def get_upload_path(instance,filename):
    return os.path.join(str(instance.folder.uid),filename) 

 
# This class represents a File model with a foreign key relationship to a Folder, a file field, and a creation date.
class Files(models.Model):
    folder=models.ForeignKey(Folder,on_delete=models.CASCADE)
    file= models.FileField(upload_to=get_upload_path)
    created_at=models.DateField(auto_now=True)
    
        
class Contact(models.Model):
    name =models.CharField(max_length=50)
    email =models.EmailField()
    subject =models.CharField(max_length=100)
    message =models.TextField()
    
    def __str__(self) ->str:
        return self.name