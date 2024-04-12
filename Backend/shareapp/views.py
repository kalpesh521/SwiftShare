from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from rest_framework import viewsets, status
import pyrebase
import os 
  
# config = {
#   "apiKey": "AIzaSyBje9AUTTUm31iJ--6zcBbf2TLKpMUr440",
#   "authDomain": "transfer-link-4991e.firebaseapp.com",
#   "projectId": "transfer-link-4991e",
#   "storageBucket": "transfer-link-4991e.appspot.com",
#   "messagingSenderId": "758175853097",
#   "appId": "1:758175853097:web:03ea706bb34f1c27ca4a38",
# }

# app = initializeApp(firebaseConfig);
import firebase_admin
from firebase_admin import credentials ,firestore

cred = credentials.Certificate(r"D:\Big Data\ShareLink\Backend\firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

db =firestore.client() 
data={
    
    'name':'Kalpesh',
    'email':'kalpeshpawar7875@gmail.com',
}
doc_ref =db.collection("info").document()
doc_ref.set(data)

print('Document ID :', doc_ref.id)
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
