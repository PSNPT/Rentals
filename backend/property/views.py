import os
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from notification.models import Notification
from comment.serializers import PropertyCommentSerializer
from .models import Property, Amenity, Accessibility, Image
from .serializers import AccessibilitySerializer, PropertySerializer, ImageSerializer, AmenitySerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .permissions import IsOwner
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from reservation.views import ReservationDestroy

class PropertyCreate(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

class PropertyDetail(RetrieveAPIView):
    permission_classes = []
    serializer_class = PropertySerializer

    def get_object(self):
        obj = get_object_or_404(Property, id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        return obj

class PropertyView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        return Property.objects.filter(host=self.request.user)

class PropertyActiveView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        return Property.objects.filter(host=self.request.user, is_active=True)
    
class PropertyInactiveView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        return Property.objects.filter(host=self.request.user, is_active=False)
    

class PropertyUpdate(UpdateAPIView):
    permission_classes = [IsAuthenticated & IsOwner]
    serializer_class = PropertySerializer

    def get_object(self):
        obj = get_object_or_404(Property, id=self.kwargs['id'], is_active=True)
        self.check_object_permissions(self.request, obj)
        return obj

class PropertyDestroy(DestroyAPIView):
    permission_classes = [IsAuthenticated & IsOwner]
    serializer_class = PropertySerializer

    def get_object(self):
        obj = get_object_or_404(Property, id=self.kwargs['id'], is_active=True)
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_destroy(self, instance):

        instance.is_active = False

        for listing in instance.listing_set.all():
            listing.is_active = False
            listing.save()
            
            for reservation in listing.reservation_set.all():
                if(reservation.status == "Completed"):
                    continue
                
                reservation.status = "Terminated"
                reservation.is_active = False
                desc = "Your request for the listing on property " + listing.property.name + " has been terminated by the host"
                Notification.objects.create(user=reservation.client ,reservation=reservation, description=desc)
                reservation.save()

        instance.save()

class PropertyActivate(RetrieveAPIView):
    permission_classes = [IsAuthenticated & IsOwner]
    serializer_class = PropertySerializer

    def get_object(self):
        obj = get_object_or_404(Property, id=self.kwargs['id'], is_active=False)
        self.check_object_permissions(self.request, obj)
        obj.is_active = True
        obj.save()
        return obj
    
class PropertyComments(ListAPIView):
    permission_classes = []
    serializer_class = PropertyCommentSerializer

    def get_queryset(self):
        obj = get_object_or_404(Property, id=self.kwargs['id'])
        comments = obj.propertycomment_set.all()

        return comments

class AmenitiesView(ListAPIView):
    paginator = None
    permission_classes = []
    serializer_class = AmenitySerializer

    

    def get_queryset(self):
        parameters = self.request.GET

        if not parameters:
            return Amenity.objects.all()
    
        ret = []
        if parameters.getlist('identifiers'):

            for amenity in parameters.getlist('identifiers'):
                if amenity.isdigit():
                    if int(amenity) >= 0:
                        ret.append(Amenity.objects.get(id=amenity))
                        
        return ret
    
    
class AccessibilityView(ListAPIView):
    paginator = None
    permission_classes = []
    serializer_class = AccessibilitySerializer

    def get_queryset(self):
        parameters = self.request.GET

        if not parameters:
            return Accessibility.objects.all()
        
        ret = []
        if parameters.getlist('identifiers'):

            for amenity in parameters.getlist('identifiers'):
                if amenity.isdigit():
                    if int(amenity) >= 0:
                        ret.append(Accessibility.objects.get(id=amenity))

        return ret
    
class ImageView(ListAPIView):
    paginator = None
    permission_classes = []
    serializer_class = ImageSerializer

    def get_queryset(self):
        parameters = self.request.GET
        ret = []
        if parameters.getlist('identifiers'):

            for amenity in parameters.getlist('identifiers'):
                if amenity.isdigit():
                    if int(amenity) >= 0:
                        ret.append(Image.objects.get(id=amenity))
        return ret

class CommentsBatchView(ListAPIView):
    paginator = None
    permission_classes = []
    serializer_class = PropertyCommentSerializer

    def get_queryset(self):
        obj = get_object_or_404(Property, id=self.kwargs['id'])
        comments = obj.propertycomment_set.all()

        return comments
    
class PropertyBatchView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer
    paginator = None
    
    def get_queryset(self):
        return Property.objects.filter(host=self.request.user)