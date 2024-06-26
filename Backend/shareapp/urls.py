
from django.urls import path , include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from shareapp.views import *
 
router = DefaultRouter()
router.register(r'handle', HandleFileUpload, basename='files')
router.register(r'contact', ContactView, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('home/', home, name='home'),
    path('download/<str:uid>/', download, name='download'),
    path('register/',UserRegistrationApiView.as_view(),name="register"),
    path('login/',UserLoginApiView.as_view(),name="login"),
    path('logout/',UserLogOutApiView.as_view(),name="logout"),
    path('token/refresh/',TokenRefreshView.as_view(),name="refresh_token"),
    path("enterroom",HomeView,name="home"),
    path("<str:room_name>/<str:username>",RoomView,name="room"),
 ]

