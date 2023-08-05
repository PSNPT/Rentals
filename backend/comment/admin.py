from django.contrib import admin
from .models import UserComment, PropertyComment

admin.site.register(UserComment)
admin.site.register(PropertyComment)