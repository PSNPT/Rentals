import os
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from accounts.models import CustomUser
from django.utils import timezone
from property.models import Property
from django.core.validators import MinValueValidator, MaxValueValidator

class Listing(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    start = models.DateField()
    end = models.DateField()
    price = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    created = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    host = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Listing"
        verbose_name_plural = "Listing"

    def __str__(self):
        return "Listing for property: " + str(self.property.name)

