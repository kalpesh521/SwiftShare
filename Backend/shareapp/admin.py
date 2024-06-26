from django.contrib import admin
from .models import Folder , Files,CustomUser , Contact,Room,Message
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserChangeForm,CustomUserCreationForm
admin.site.register(Folder),
admin.site.register(Files),
admin.site.register(Contact)
admin.site.register(Room)
admin.site.register(Message)
@admin.register(CustomUser)
class CustomAdminUser(UserAdmin):
    add_form=CustomUserCreationForm
    form = CustomUserChangeForm
    model=CustomUser
    
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
