from django.contrib import admin
from .models import Folder , Files,CustomUser
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserChangeForm,CustomUserCreationForm
admin.site.register(Folder),
admin.site.register(Files)
# admin.site.register(CustomUser)
@admin.register(CustomUser)
class CustomAdminUser(UserAdmin):
    add_form=CustomUserCreationForm
    form = CustomUserChangeForm
    model=CustomUser
