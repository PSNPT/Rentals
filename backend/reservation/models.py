import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from accounts.models import CustomUser
from django.utils import timezone
from property.models import Property
from listing.models import Listing

class Reservation(models.Model):
        
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    host = models.ForeignKey( CustomUser, on_delete=models.CASCADE, related_name="Rhost")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    start = models.DateField()
    end = models.DateField()
    status = models.CharField(max_length=10)
    created = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Reservation"
        verbose_name_plural = "Reservations"

    def __str__(self):
        return "Reservation by " + str(self.client.first_name) + " for listing: " + str(self.listing.id)

