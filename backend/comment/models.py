import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from accounts.models import CustomUser
from django.utils import timezone
from property.models import Property
from reservation.models import Reservation
from django.core.validators import MinValueValidator, MaxValueValidator

class PropertyComment(models.Model):

    child = models.ForeignKey("PropertyComment", null=True, blank=True, on_delete=models.CASCADE)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    commenter = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=-1)
    timetag = models.DateTimeField("comment date", default=timezone.now)
    is_parent = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Property Comment"
        verbose_name_plural = "Property Comments"

    def __str__(self):
        return "Comment for property: " + str(self.property.name) + "Comment ID: " + str(self.pk)

class UserComment(models.Model):

    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    timetag = models.DateTimeField("comment date", default=timezone.now)
    
    class Meta:
        verbose_name = "User Comment"
        verbose_name_plural = "User Comments"

    def __str__(self):
        return "Comment for user: " + str(self.user.email) + "Comment ID: " + str(self.pk)