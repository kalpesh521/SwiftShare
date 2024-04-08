
from django.urls import path , include
from rest_framework.routers import DefaultRouter
from shareapp.views import *
# from .views import home , download    
# urlpatterns = [
#     path('',home),
#     path('download/<uid>',download),
#     path('admin/', admin.site.urls),
#     path('handle/', HandleFileUpload.as_view()),
    
# ]

router = DefaultRouter()
router.register(r'handle', HandleFileUpload, basename='files')

urlpatterns = [
    path('', include(router.urls)),
    path('home/', home, name='home'),
    path('download/<str:uid>/', download, name='download'),
 ]

