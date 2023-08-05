import os
from django.shortcuts import render
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from notification.models import Notification
from .models import Listing
from .serializers import ListingSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .permissions import IsOwner
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
import datetime
from rest_framework.serializers import ModelSerializer, CharField, ValidationError, HyperlinkedModelSerializer

class ListingCreate(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

class ListingDetail(RetrieveAPIView):
    permission_classes = []
    serializer_class = ListingSerializer

    def get_object(self):
        return get_object_or_404(Listing, id=self.kwargs['id'])

class ListingView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

    def get_queryset(self):
        return Listing.objects.filter(property__host=self.request.user)

class ListingActiveView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

    def get_queryset(self):
        return Listing.objects.filter(property__host=self.request.user, is_active=True)
    
class ListingInactiveView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer

    def get_queryset(self):
        return Listing.objects.filter(property__host=self.request.user, is_active=False)
    
class ListingBatchView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer
    paginator = None

    def get_queryset(self):
        return Listing.objects.filter(property__host=self.request.user)

class ListingUpdate(UpdateAPIView):
    permission_classes = [IsAuthenticated & IsOwner]
    serializer_class = ListingSerializer

    def get_object(self):
        obj = get_object_or_404(Listing, id=self.kwargs['id'], is_active=True)
        self.check_object_permissions(self.request, obj)
        return obj

class ListingDestroy(DestroyAPIView):
    permission_classes = [IsAuthenticated & IsOwner]
    serializer_class = ListingSerializer

    def get_object(self):
        obj = get_object_or_404(Listing, id=self.kwargs['id'], is_active=True)
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_destroy(self, instance):
        instance.is_active = False

        for reservation in instance.reservation_set.all():
            if(reservation.status == "Completed"):
                continue
            reservation.status = "Terminated"
            reservation.is_active = False
            desc = "Your request for the listing on property " + instance.property.name + " has been terminated by the host"
            Notification.objects.create(user=reservation.client ,reservation=reservation, description=desc)
            reservation.save()
            
        instance.save()

class ListingSearch(ListAPIView):
    permission_classes = []
    serializer_class = ListingSerializer

    def get_queryset(self):
        date_format = '%Y-%m-%d'
        errors = []
        valid = False

        ret = Listing.objects.filter(is_active=True)
        
        parameters = self.request.GET

        if parameters.get('location'):
            ret = ret.filter(property__location__contains=parameters.get('location'))


        if parameters.get('start'):
            try:

                temp = datetime.datetime.strptime(parameters.get('start'), date_format)

                ret = ret.filter(start__lte=parameters.get('start'), end__gte=parameters.get('start'))

            except ValueError:      
                errors.append("Start date parameter is invalid")

        
        if parameters.get('end'):
            try:

                temp = datetime.datetime.strptime(parameters.get('start'), date_format)

                ret = ret.filter(end__gte=parameters.get('end'), start__lte=parameters.get('end'))

            except ValueError:      
                errors.append("End date parameter invalid")

        if parameters.get('bed'):
            valid = False
            if parameters.get('bed').isdigit():
                if int(parameters.get('bed')) >= 0:
                    valid = True
                    ret = ret.filter(property__bed__gte=parameters.get('bed'))
            
            if not valid:
                errors.append("Bed parameter is invalid")

        if parameters.get('bath'):
            valid = False

            if parameters.get('bath').isdigit():
                if int(parameters.get('bath')) >= 0:
                    valid = True
                    ret = ret.filter(property__bath__gte=parameters.get('bath'))

            if not valid:
                errors.append("Bath parameter is invalid")

        if parameters.get('price'):
            valid = False

            if parameters.get('price').isdigit():
                if int(parameters.get('price')) >= 0:
                    valid = True
                    ret = ret.filter(price__lte=parameters.get('price'))

            if not valid:
                errors.append("Price parameter is invalid")

        if parameters.get('parking'):
            valid = False

            if parameters.get('parking').isdigit():
                if int(parameters.get('parking')) >= 0:
                    valid = True
                    ret = ret.filter(property__parking__gte=parameters.get('parking'))

            if not valid:
                errors.append("Parking parameter is invalid")

        if parameters.get('occupancy'):
            valid = False

            if parameters.get('occupancy').isdigit():
                if int(parameters.get('occupancy')) >= 0:
                    valid = True
                    ret = ret.filter(property__occupancy__gte=parameters.get('occupancy'))

            if not valid:
                errors.append("Occupancy parameter is invalid")

        if parameters.get('host'):
            valid = False

            if parameters.get('host').isdigit():
                if int(parameters.get('host')) >= 0:
                    valid = True
                    ret = ret.filter(property__host__id=parameters.get('host'))

            if not valid:
                errors.append("Host parameter is invalid")

        if parameters.getlist('amenities'):
            valid = False

            for amenity in parameters.getlist('amenities'):

                if amenity.isdigit():
                    if int(amenity) >= 0:
                        valid = True
                        ret = ret.filter(property__amenities__id=amenity)
                        continue

                valid = False
                break

            if not valid:
                errors.append("Amenities parameter is invalid") 

        if parameters.getlist('accessibility'):
            valid = False
            
            for tag in parameters.getlist('accessibility'):

                if tag.isdigit():
                    if int(tag) >= 0:
                        valid = True
                        ret = ret.filter(property__accessibility__id=tag)
                        continue

                valid = False
                break

            if not valid:
                errors.append("Accessibility parameter is invalid") 

        if parameters.get('order'):

            descending = ''

            if parameters.get('descending'):
                if parameters.get('descending') in ["True", "False"]:
                    if parameters.get('descending') == "True":
                        descending = '-'
                else:
                    errors.append("Invalid input for descending option")

            if parameters.get('order') in ['occupancy', 'bed', 'bath', 'parking']:
                ret = ret.order_by(descending+"property__"+parameters.get('order'))
            elif parameters.get('order') in ['price', 'start', 'end']:
                ret = ret.order_by(descending+parameters.get('order'))
            else:
                errors.append("Invalid attribute used for ordering")

        if errors:
            raise ValidationError(errors)
        
        return ret