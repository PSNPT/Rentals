import os
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from notification.models import Notification
from .models import Reservation
from .serializers import ReservationSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .permissions import IsClientOrHost, IsClient, IsHost
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
import datetime
from rest_framework.serializers import ModelSerializer, CharField, ValidationError

EXPIRY = 7
PRENOTIF = 2

class ReservationCreate(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer

class ReservationDetail(RetrieveAPIView):
    permission_classes = [IsAuthenticated & IsClientOrHost]
    serializer_class = ReservationSerializer

    def get_object(self):
        obj = get_object_or_404(Reservation, id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        completedcheck(obj)
        expirycheck(obj)
        return obj

class ReservationDestroy(DestroyAPIView):
    permission_classes = [IsAuthenticated & IsClientOrHost]
    serializer_class = ReservationSerializer

    def get_object(self):
        obj = get_object_or_404(Reservation, id=self.kwargs['id'], is_active=True)
        self.check_object_permissions(self.request, obj)

        completedcheck(obj)
        expirycheck(obj)
        
        return obj

    def perform_destroy(self, instance):
        instance.is_active = False

        if(instance.status == "Pending"):
            if(self.request.user == instance.client):
                instance.status = "Cancelled"
                desc = "A reservation request for the listing on property " + instance.listing.property.name + " has been cancelled by the client"
                Notification.objects.create(user=instance.listing.property.host ,reservation=instance, description=desc)
            else:
                instance.status = "Denied"
                desc = "Your reservation request for the listing on property " + instance.listing.property.name + " has been denied"
                Notification.objects.create(user=instance.client ,reservation=instance, description=desc)

        elif (instance.status == "Approved"):
            if(self.request.user == instance.client):
                instance.is_active = True
                instance.status = "Pending Cancellation"
                desc = "A reservation you approved for the listing on property " + instance.listing.property.name + " has requested cancellation"
                Notification.objects.create(user=instance.listing.property.host ,reservation=instance, description=desc)
            else:
                instance.status = "Terminated"
                desc = "Your approved request for the listing on property " + instance.listing.property.name + " has been terminated by the host"
                Notification.objects.create(user=instance.client ,reservation=instance, description=desc)

        elif (instance.status == "Pending Cancellation"):
            if(self.request.user == instance.client):
                raise ValidationError("Cannot cancel this reservation with status: "+instance.status)
            else:
                instance.is_active = True
                instance.status = "Approved"

                desc = "Your cancellation request for the listing on property " + instance.listing.property.name + " has been denied"
                Notification.objects.create(user=instance.client ,reservation=instance, description=desc)

        else:
            raise ValidationError("Cannot cancel this reservation with status: "+instance.status)
        
        instance.save()

class ReservationApprove(RetrieveAPIView):
    permission_classes = [IsAuthenticated & IsHost]
    serializer_class = ReservationSerializer

    def get_object(self):
        obj = get_object_or_404(Reservation, id=self.kwargs['id'], is_active=True)
        self.check_object_permissions(self.request, obj)
        
        completedcheck(obj)
        expirycheck(obj)
        
        if(obj.status == "Pending"):
            obj.status = "Approved"

            desc = "Your reservation request for the listing on property " + obj.listing.property.name + " has been approved"
            Notification.objects.create(user=obj.client ,reservation=obj, description=desc)

        elif (obj.status == "Pending Cancellation"):
            obj.is_active = False
            obj.status = "Cancelled"
            desc = "Your cancellation request for the listing on property " + obj.listing.property.name + " has been approved"
            Notification.objects.create(user=obj.client ,reservation=obj, description=desc)
        else:
            raise ValidationError("Cannot approve this reservation with status: "+obj.status)
        
        obj.save()
        return obj
    

def expirycheck(obj):
    today = datetime.datetime.now().date()
    delta = today - obj.created
    if(obj.is_active and obj.status == "Pending" and delta.days >= EXPIRY):
        obj.status = "Expired"
        obj.is_active = False
        obj.save()

        # For client
        desc = "Your reservation request for the listing on property " + obj.listing.property.name + " has expired"
        Notification.objects.create(user=obj.client ,reservation=obj, description=desc)

        # For Host
        desc = "The reservation request for your listing on property " + obj.listing.property.name + " has expired"
        Notification.objects.create(user=obj.listing.property.host ,reservation=obj, description=desc)

        return True
    return False

def completedcheck(obj):
    today = datetime.datetime.now().date()

    if(obj.is_active and obj.status == "Approved" and today > obj.end):
        obj.status = "Completed"
        obj.is_active = False
        obj.save()

        # For client
        desc = "How did you enjoy your stay at " + obj.listing.property.name + "?"
        Notification.objects.create(user=obj.client ,reservation=obj, description=desc)

        return True
    return False

def prestartcheck(obj):
    today = datetime.datetime.now().date()
    delta = obj.start - today

    if(obj.is_active and obj.status == "Approved" and delta.days <= PRENOTIF and delta.days > 0):
        # For client
        desc = "Your reservation for your stay at " + obj.listing.property.name + "is coming up!"

        alreadysent = Notification.objects.filter(user=obj.client ,reservation=obj, description=desc)

        if(not alreadysent):
            Notification.objects.create(user=obj.client ,reservation=obj, description=desc)

class ReservationSearch(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer

    def get_queryset(self):
        errors = []

        ret = Reservation.objects.filter(listing__property__host=self.request.user) | Reservation.objects.filter(client=self.request.user)
        
        for obj in ret:
            completedcheck(obj)
            expirycheck(obj)
            prestartcheck(obj)
            
        parameters = self.request.GET

        if parameters.get('type'):
            if parameters.get('type') not in ["host", "client"]:
                errors.append("Type parameter invalid")
            else:
                if parameters.get('type') == "host":
                    ret = ret.filter(listing__property__host=self.request.user)
                else:
                    ret = ret.filter(client=self.request.user)

        if parameters.get('status'):
            if parameters.get('status') not in ["Pending", "Pending Cancellation", "Cancelled", "Denied", "Terminated", "Approved", "Expired", "Completed"]:
                errors.append("Status parameter invalid")
            else:
                ret = ret.filter(status=parameters.get('status'))

        if errors:
            raise ValidationError(errors)
        
        return ret