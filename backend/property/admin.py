from django.contrib import admin
from .models import Amenity, Accessibility, Image, Property

admin.site.register(Amenity)
admin.site.register(Accessibility)
admin.site.register(Image)
admin.site.register(Property)