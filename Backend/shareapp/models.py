from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
import os
from django.core.validators import URLValidator

def unique_id():
    return uuid.uuid4().hex
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return self.email
class Folder(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, null=True)
    uid = models.UUIDField(primary_key=True, editable=False, default=unique_id)
    created_at = models.DateField(auto_now=True)

def get_upload_path(instance, filename):
    return os.path.join(str(instance.folder.uid), filename)

class Files(models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)
    file = models.FileField(upload_to=get_upload_path)
    created_at = models.DateField(auto_now=True)

class Contact(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    subject = models.CharField(max_length=100)
    message = models.TextField()

    def __str__(self) -> str:
        return self.name

class SignedUrl(models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True)
    url = models.TextField(validators=[URLValidator()])
    allowed_users = models.ManyToManyField(CustomUser, related_name="signed_urls")
    expiry_in = models.IntegerField(null=True, default=600)  # store time in seconds
    created_at = models.DateTimeField(auto_now_add=True)

class Room(models.Model):
    ROOM_CHOICES = [
        ('room1-GI', 'General Inquiry'),
        ('room2-TS', 'Technical Support'),
        ('room3-SC', 'Security Concerns'),
        ('room4-OTH', 'Other'),
    ]
    room_name = models.CharField(max_length=50,choices = ROOM_CHOICES)
    
    def __str__(self):
        return self.room_name
    
class Message (models.Model):
    room = models.ForeignKey(Room,on_delete=models.CASCADE)
    sender = models.CharField(max_length=50)
    message =models.TextField()
    
    def __str__(self):
        return f"{str(self.room)} - {self.sender}"
    
