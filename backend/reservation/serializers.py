from django.urls import reverse
from rest_framework.serializers import ModelSerializer, CharField, ValidationError, HyperlinkedModelSerializer
from accounts.models import CustomUser
from .models import Reservation
from rest_framework import serializers
import os
from datetime import datetime
from listing.serializers import ListingSerializer
from notification.models import Notification

class ReservationSerializer(ModelSerializer):
    #listingdetails = ListingSerializer(required=False, read_only=True, source='listing')

    class Meta:
        model = Reservation
        fields = ['url', 'id', 'client','listing', 'start', 'end', 'status', 'host', 'is_active']
        read_only_fields = ['client', 'status', 'host', 'is_active']
        # fields += ['listingdetails']
        extra_kwargs = {
                    'url': {'view_name': 'reservation:detail', 'lookup_field': 'id', 'lookup_url_kwarg': 'id'}
                }
        
    def validate_listing(self, value):
        if self.context['request'].method in ['POST', 'PUT', 'PATCH']:
            if(value.property.host == self.context['request'].user):
                raise ValidationError("You cannot place a reservation for your own property")
            if(not value.is_active):
                raise ValidationError("Invalid listing for reservation")
            
        if not value.is_active:
            raise ValidationError("This listing is inactive")
        
        return value
    
    def validate(self, attrs):
        if attrs['listing'].start <= attrs['start'] and attrs['end'] <= attrs['listing'].end:
            if(attrs['start'] <= attrs['end']):

                for reservation in Reservation.objects.all().filter(listing=attrs['listing']):
                    if reservation.status in ['Cancelled', 'Terminated']:
                        continue
                    if(reservation.start <= attrs['start'] and attrs['start'] <= reservation.end):
                        raise ValidationError("Requested start date conflicts with another reservation")
                    if(reservation.start <= attrs['end'] and attrs['end'] <= reservation.end):
                        raise ValidationError("Requested end date conflicts with another reservation")
                                   
                return super().validate(attrs)
            else:
               raise ValidationError("End date must be at or after start date") 
        else:
            raise ValidationError("Reservation must be within listing's time period")
    
    def create(self, validated_data):
        reservation = Reservation.objects.create(client=self.context['request'].user,
                                                 listing=validated_data['listing'],
                                                 start=validated_data['start'],
                                                 end=validated_data['end'],
                                                 status='Pending',
                                                 host=validated_data['listing'].property.host)
        
        desc = "You have a new reservation request for your listing on property " + validated_data['listing'].property.name
        Notification.objects.create(user=validated_data['listing'].property.host ,reservation=reservation, description=desc)
        

        return reservation