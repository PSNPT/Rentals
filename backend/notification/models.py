import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from accounts.models import CustomUser
from django.utils import timezone
from listing.models import Listing
from reservation.models import Reservation

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    description = models.CharField(max_length=200)
    read = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return self.description
