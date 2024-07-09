from datetime import timedelta
from email.utils import formataddr
from django.shortcuts import render ,redirect
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from pytz import timezone as pytz_timezone
from shareapp.models import Contact, CustomUser, Folder, SignedUrl ,Room ,Message
from shareapp.serializers import (
    ContactSerializer,
    CustomUserSerializer,
    FileListSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
)
from shareapp.supabase_utils import create_signed_url
from shareapp.utils import download_zip
from django.core.mail import send_mail
from sharefile.settings import EMAIL_HOST_USER

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
        print(folder_id)
        if request.method == "POST":
            data = request.data
            try:
                recipient_email = data.get("email")
                print(recipient_email)
                if not recipient_email:
                    return Response({'detail': "Recipient email is required"}, status=status.HTTP_400_BAD_REQUEST)

                expiry_duration = data.get("expiry", 7 * 24 * 60 * 60)
                signed_url_data = create_signed_url(filepath=f"{folder_id}/{folder_id}.zip", expiry_duration=expiry_duration)
                
                expiration_date_utc = timezone.now() + timedelta(seconds=expiry_duration)
                ist = pytz_timezone('Asia/Kolkata')
                expiration_date_ist = expiration_date_utc.astimezone(ist)
                expiration_date_str = expiration_date_ist.strftime('%d-%m-%Y %H:%M:%S %Z')

                print(signed_url_data)
                subject = "Unlock Files Now, Just Click Away"

                from_email = formataddr(("SwiftShare", EMAIL_HOST_USER))

                message = f"""
                <html>
                    <body>
                        <p>Hello,</p>
                        <p>You have received a link through SwiftShare. Please find the details below:</p>
                        <p>To download the file, simply click on the link. Please note that the link will expire on the specified date, so make sure to download the file before the expiration date.</p>
                        <p><strong>File Link:</strong> <a href="{signed_url_data['signedURL']}">{signed_url_data['signedURL']}</a></p>
                        <p><strong>Expiration Date:</strong> {expiration_date_str}</p>
                        <p>If you have any questions or need assistance, feel free to contact us.</p>
                        <p>Best regards,</p>
                        <p><strong>Team SwiftShare</strong></p>
                    </body>
                </html>
                """
                send_mail(subject, '', from_email, [recipient_email], fail_silently=True, html_message=message)
                print("Email Sent")
            except Exception as ex:
                return Response({'detail': 'Error in getting URL', 'error': str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if not signed_url_data.get('signedURL'):
                return Response({'detail': 'Error in getting URL'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({
                'detail': signed_url_data['signedURL'],
                'expiration_date': expiration_date_str
            }, status=status.HTTP_200_OK)

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
            if user:
                data["authorised_users"].append(user.email)
                signed_url.allowed_users.add(user)
            else:
                data["not_found_users"].append(user_email)
        return Response(data, status=status.HTTP_200_OK)

class ContactView(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
     
def HomeView (request): 
    if request.method == 'POST':
        username = request.POST['username']
        room = request.POST['room']
        try :
            existing_room = Room.objects.get(room_name__icontains = room)
        except Room.DoesNotExist:
            r = Room.objects.create(room_name = room)
        return redirect("room",room_name = room , username = username)   
    return render(request ,'login.html')

def RoomView (request,room_name , username):
    existing_room = Room.objects.get(room_name__icontains=room_name)
    get_messages = Message.objects.filter(room=existing_room)
    context = {
        "messages": get_messages,
        "user": username,
        "room_name": existing_room.room_name,
    }
    return render(request ,'chat.html',context)