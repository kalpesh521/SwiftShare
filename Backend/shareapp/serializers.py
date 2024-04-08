import shutil
from rest_framework import serializers
from .models import *

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