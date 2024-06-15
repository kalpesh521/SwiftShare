import urllib.parse
from datetime import timedelta

from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from shareapp.models import SignedUrl, Folder, CustomUser, Contact
from shareapp.serializers import UserLoginSerializer, UserRegistrationSerializer, CustomUserSerializer, \
    ContactSerializer, FileListSerializer
from shareapp.supabase_utils import create_signed_url
from shareapp.utils import download_zip


class UserRegistrationApiView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token),
                          "access": str(token.access_token)}
        return Response(data, status=status.HTTP_201_CREATED)


class UserLoginApiView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["token"] = {"refresh": str(token),
                         "access": str(token.access_token)}
        return Response(data, status=status.HTTP_200_OK)


class UserLogOutApiView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def home(request):
    return render(request, 'home.html')


def download(request, uid):
    return render(request, 'download-file.html', context={'uid': uid})


class HandleFileUpload(viewsets.ModelViewSet):
    serializer_class = FileListSerializer
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        raise MethodNotAllowed('GET', detail='Method not allowed')

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data, context={"user": request.user})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                'status': status.HTTP_201_CREATED,
                'message': 'Successfully uploaded file!',
                'data': serializer.data,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Something went wrong',
                'data': e,
            })

    @action(detail=True, methods=['get', 'post'])
    def get_sign_url(self, request, pk=None):
        folder = Folder.objects.filter(pk=pk, user__email=self.request.user.email).first()
        if not folder:
            return Response({'detail': "Folder not found"}, status=status.HTTP_404_NOT_FOUND)
        folder_id = folder.uid.hex
        if request.method == "POST":
            data = request.data
            try:
                signed_url_data = create_signed_url(filepath=f"{folder_id}/{folder_id}.zip",
                                                    expiry_duration=data.get("expiry",
                                                                             600))  # url will be expired in 1hr default
                print(signed_url)
            except Exception as ex:
                print(ex)
                return Response({'detail': 'Error in getting url', 'error': str(ex)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            signed_url = SignedUrl.objects.create(
                folder_id=folder_id,
                url=signed_url_data['signedURL'],
                expiry_in=data.get("expiry", 600)
            )
            signed_url.allowed_users.add(CustomUser.objects.filter(email=request.user.email).first())
            signed_path = request.build_absolute_uri() + "?"
            signed_params = {"signed": "true", "download": "true", "signed_id": signed_url.id,
                             "signer_id": request.user.id,
                             "signed_at": signed_url.created_at}
            signed_path += urllib.parse.urlencode(signed_params)
            return Response({"signed_url": signed_path, "signed_id": signed_url.id, "folder_id": folder_id},
                            status=status.HTTP_200_OK)

        _download = request.query_params.get("download", False)
        signed = request.query_params.get('signed', False)
        signed_id = request.query_params.get("signed_id", None)
        if not _download or not signed or not signed_id:
            return Response({'detail': "Invalid Url request"}, status=status.HTTP_400_BAD_REQUEST)
        signed_url_data = SignedUrl.objects.filter(id=signed_id, allowed_users__email=request.user.email).first()
        if not signed_url_data:
            return Response({'detail': "Url is expired."}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() > signed_url_data.created_at + timedelta(seconds=signed_url_data.expiry_in):
            SignedUrl.objects.filter(id=signed_id).delete()
            return Response({'detail': "Url is expired"}, status=status.HTTP_403_FORBIDDEN)
        if not signed_url_data:
            return Response({'detail': "Invalid url"}, status=status.HTTP_404_NOT_FOUND)
        zip_file = download_zip(signed_url_data.url, folder_id=folder_id, signed_id=signed_id)
        if not zip_file:
            return Response({'detail': "Invalid url"}, status=status.HTTP_404_NOT_FOUND)
        return zip_file

    @action(detail=True, methods=['post'])
    def share_sign_url(self, request, pk=None):
        folder = Folder.objects.filter(pk=pk, user__email=self.request.user.email).first()
        if not folder:
            return Response({'detail': "Folder not found"}, status=status.HTTP_404_NOT_FOUND)
        authorised_users = request.data.get("authorised_users", [])
        if not authorised_users:
            return Response({'detail': "User detail required"}, status=status.HTTP_400_BAD_REQUEST)
        folder_id = folder.uid.hex
        signed_id = request.query_params.get("signed_id", None)
        if not signed_id:
            return Response({'detail': 'Signed id is required'}, status=status.HTTP_400_BAD_REQUEST)
        signed_url = SignedUrl.objects.filter(id=signed_id, folder_id=folder_id).first()
        if not signed_url:
            return Response({'detail': "Signed Url not found or it is expired."}, status=status.HTTP_404_NOT_FOUND)
        data = {"detail": "Access given successfully", "authorised_users": [], "not_found_users": []}
        for user_email in authorised_users:
            user = CustomUser.objects.filter(email=user_email).first()
            # return the both added and not found users
            if user:
                data["authorised_users"].append(user.email)
                signed_url.allowed_users.add(user)
            else:
                data["not_found_users"].append(user_email)
        return Response(data, status=status.HTTP_200_OK)


class ContactView(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
