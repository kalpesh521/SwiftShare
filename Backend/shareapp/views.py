from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *

def home(request):
    return render(request,'home.html')

def download(request,uid):
    return render(request,'download-file.html',context={'uid':uid})


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

from rest_framework import viewsets, status
from rest_framework.response import Response
from.serializers import *
 
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
