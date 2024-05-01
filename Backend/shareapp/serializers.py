import shutil
from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id","username","email")
class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only =True)
    password2 = serializers.CharField(write_only =True)
    class Meta:
        model = CustomUser
        fields = ("id","username","email","password1","password2")
        extra_kwargs= {"password":{"write_only":True}}
        
    def validate(self,attrs):
            if attrs['password1']!=attrs['password2']:
                raise serializers.ValidationError("Password do not match!")
            
            password = attrs.get("password1", "")
            if len(password)<8:
                raise serializers.ValidationError("Password must be at least 8 characters!")
            return attrs

    def create(self,validated_data):
            password = validated_data.pop("password1")
            validated_data.pop("password2")
            return CustomUser.objects.create_user(password=password,**validated_data)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(seld,data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect User")
    
# Serializer for the Files model
class FileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Files
        fields = '__all__' 
        
# Serializer for handling file uploads and zipping them into a folder
class FileListSerializer(serializers.Serializer):
    files = serializers.ListField(
        child = serializers.FileField(max_length = 100000 , allow_empty_file = False , use_url = False)
    )
    folder = serializers.CharField(required = False)
    
    # Method to zip files in a given folder
    def zip_files(self,folder):
        shutil.make_archive(f'public/static/zip/{folder}' , 'zip' ,f'public/static/{folder}' )

 # Method to create a new folder, save files to it, and zip the folder
    def create(self , validated_data):
        folder = Folder.objects.create()
        files = validated_data.pop('files')
        files_objs = []
        for file in files:
            files_obj = Files.objects.create(folder = folder , file = file)
            files_objs.append(files_obj)  
        self.zip_files(folder.uid)
        return {'files' : {} , 'folder' : str(folder.uid)}
    
    