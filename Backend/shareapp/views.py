from logging import raiseExceptions
from django.shortcuts import render
from rest_framework.response import Response
from .serializers import *
from rest_framework import viewsets, status 
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
 
import pyrebase
import os 
  

# app = initializeApp(firebaseConfig);
# import firebase_admin
# from firebase_admin import credentials ,firestore

# cred = credentials.Certificate(r"D:\Big Data\ShareLink\Backend\firebase-adminsdk.json")
# firebase_admin.initialize_app(cred)

# db =firestore.client() 
# data={
    
#     'name':'Kalpesh',
#     'email':'kalpeshpawar7875@gmail.com',
# }
# doc_ref =db.collection("info").document()
# doc_ref.set(data)

# print('Document ID :', doc_ref.id)



class UserRegistrationApiView(GenericAPIView):
    permission_classes =(AllowAny,)
    serializer_class = UserRegistrationSerializer
    
    def post(self,request ,*args ,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user= serializer.save()
        token =RefreshToken.for_user(user)
        data = serializer.data    
        data["tokens"] ={"refresh":str(token),
                         "access":str(token.access_token)}    
        return Response(data,status=status.HTTP_201_CREATED)
    
    
class UserLoginApiView(GenericAPIView):
    permission_classes =(AllowAny,)
    serializer_class= UserLoginSerializer
    
    def post(self,request,*args,**kwargs):
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user=serializer.validated_data
        serializer=CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["token"] ={"refresh":str(token),
                        "access":str(token.access_token)}
        return Response(data ,status =status.HTTP_200_OK)
 
class UserLogOutApiView(GenericAPIView):
    permission_classes =(IsAuthenticated,) 
    def post(self,request,*args,**kwargs):
        try:
            refresh_token = request.data["refresh"]  
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)   
     
def home(request):
    return render(request,'home.html')

def download(request,uid):
    return render(request,'download-file.html',context={'uid':uid})

class  HandleFileUpload(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FileListSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                'status': status.HTTP_201_CREATED,
                'message': 'Successfully uploaded file!',
                'data': serializer.data,
             })
        except Exception as e:
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Something went wrong',
                'data': serializer.errors,
             })


# class HandleFileUpload(APIView):
#     # This method handles POST requests for file uploads
#     def post(self,request):
#         try:         
#             data=request.data
#             serializer= FileListSerializer(data=data)
            
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response({
#                     'status':200,
#                     'message':'Successfully uploaded file ! ',
#                     'data':serializer.data,
#                 })
#             return Response({
#                     'status':400,
#                     'message':'Something went wrong',
#                     'data':serializer.errors,
#                     })
#         except Exception as e : 
#               print(e) 
