from django.urls import reverse
from rest_framework.serializers import ModelSerializer, CharField, ValidationError, HyperlinkedModelSerializer
from accounts.models import CustomUser
from .models import Listing
from rest_framework import serializers
import os
from datetime import datetime
from property.serializers import PropertySerializer


class ListingSerializer(ModelSerializer):
    #propertydetails = PropertySerializer(required=False, read_only=True, source='property')

    class Meta:
        model = Listing
        fields = ['url', 'id', 'property','start', 'end', 'price', 'created', 'is_active', 'host']
        # fields += ['propertydetails']
        read_only_fields = ['created', 'is_active', 'host']
        extra_kwargs = {
                    'url': {'view_name': 'listing:detail', 'lookup_field': 'id', 'lookup_url_kwarg': 'id'}
                }
        
    def validate_start(self, value):
        if(value < datetime.now().date()):
            raise ValidationError("Start date cannot be in the past")

        return value
    
    def validate_end(self, value):
        if(value < datetime.now().date()):
            raise ValidationError("End date cannot be in the past")

        return value
    
    def validate_property(self, value):
        if self.context['request'].method in ['POST', 'PUT', 'PATCH']:
            if(value.host != self.context['request'].user):
                raise ValidationError("You do not own this property")
            
        if not value.is_active:
            raise ValidationError("This property is inactive")
            
        return value
    
    def validate(self, attrs):
        if('start' in attrs and 'end' in attrs):
            if(attrs['start'] <= attrs['end']):
                return super().validate(attrs)
            else:
                raise ValidationError("End date must be at or after start date") 
        return super().validate(attrs)
        

    def create(self, validated_data):
        listing = Listing.objects.create(property=validated_data['property'],
                                           start=validated_data['start'],                                           
                                           end=validated_data['end'],
                                           price=validated_data['price'],
                                           host=validated_data['property'].host,
                                           )

        listing.save()
        return listing
    
    def update(self, instance, validated_data):

        if('start' in validated_data and 'end' in validated_data):
            if(validated_data['start'] <= validated_data['end']):
                return super().update(instance, validated_data)
            else:
                raise ValidationError("End date must be at or after start date") 
        elif ('start' not in validated_data and 'end' not in validated_data):
            return super().update(instance, validated_data)
        elif ('start' in validated_data):
            if(validated_data['start'] <= instance.end):
                return super().update(instance, validated_data)
            else:
                raise ValidationError("End date must be at or after start date") 
        elif ('end' in validated_data):
            if(instance.start <= validated_data['end']):
                return super().update(instance, validated_data)
            else:
                raise ValidationError("End date must be at or after start date") 
        return super().update(instance, validated_data)
