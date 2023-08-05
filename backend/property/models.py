import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from accounts.models import CustomUser
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
    
class Amenity(models.Model):
    name = models.CharField(max_length=50)
    icon = models.ImageField(upload_to='icons/amenity/', default="icons/amenity/default.jpg")

    class Meta:
        verbose_name = "Amenity"
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name
    
class Accessibility(models.Model):
    name = models.CharField(max_length=50)
    icon = models.ImageField(upload_to='icons/accessibility/', default="icons/accessibility/default.jpg")

    class Meta:
        verbose_name = "Accessibility"
        verbose_name_plural = "Accessibilities"

    def __str__(self):
        return self.name
    

class Property(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    accessibility = models.ManyToManyField(Accessibility, blank=True)
    amenities = models.ManyToManyField(Amenity, blank=True)
    bed = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    bath = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    parking = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    occupancy = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    description = models.CharField(max_length=500)
    host = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"

    def __str__(self):
        return self.name

def get_upload_path(instance, filename):
    return os.path.join("property/", str(instance.property.id), filename)

class Image(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    img = models.ImageField(upload_to= get_upload_path, default="property/default.png")

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"

    def __str__(self):
        return  self.img.name