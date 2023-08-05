from rest_framework.serializers import ModelSerializer, CharField, ValidationError, HyperlinkedModelSerializer
from accounts.models import CustomUser
from .models import Notification
from rest_framework import serializers
import os

class NotificationSerializer(ModelSerializer):

    #reservationdetails = ReservationSerializer(required=False, read_only=True, source='reservation')

    class Meta:
        model = Notification
        fields = ['url', 'id', 'reservation', 'description', 'read']
        read_only_fields = ['reservation', 'description', 'read']
        extra_kwargs = {
                    'url': {'view_name': 'notification:detail', 'lookup_field': 'id', 'lookup_url_kwarg': 'id'}
                }
    
