from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.serializers import ValidationError

from shareapp.models import CustomUser, Files, Folder, Contact
from shareapp.supabase_utils import upload_file
from shareapp.utils import remove_local_folder
from shareapp.utils import zip_files


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "password1", "password2")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Password do not match!")

        password = attrs.get("password1", "")
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters!")
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        return CustomUser.objects.create_user(password=password, **validated_data)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
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
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False)
    )
    folder = serializers.CharField(required=False)

    # Method to create a new folder, save files to it, and zip the folder
    def create(self, validated_data):
        from django.db import transaction
        user = self.context.get('user')
        if not user:
            raise ValidationError('User not found')
        user = CustomUser.objects.filter(email=user).first()
        if not user:
            raise ValidationError('User not found')
        files = validated_data.pop('files')
        try:
            with transaction.atomic():
                folder = Folder.objects.create(user=user)
                for file in files:
                    Files.objects.create(folder=folder, file=file)
                zip_file_name = zip_files(folder.uid)
                upload_file(zip_file_name, folder_id=folder.uid, _zip=True)
        except Exception as ex:
            print(ex)
            # return None
            # raise ex
        # remove the uploaded local content
        remove_local_folder(folder_id=folder.uid)
        remove_local_folder(folder_id=folder.uid, extra_path="zip_files")
        return {'files': {}, 'folder': str(folder.uid)}


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ("id", "name", "email", "subject", "message")
