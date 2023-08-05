from django.urls import reverse
from rest_framework.serializers import ModelSerializer, CharField, ValidationError, HyperlinkedModelSerializer
from accounts.models import CustomUser
from .models import PropertyComment, UserComment
from rest_framework import serializers
import os
from datetime import datetime
from property.serializers import PropertySerializer


class PropertyCommentSerializer(ModelSerializer):
    timetag = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = PropertyComment
        fields = ['id', 'child','reservation', 'property', 'description', 'commenter', 'rating', 'timetag', 'is_parent']
        read_only_fields = ['property', 'child', 'commenter', 'is_parent']

    def validate_reservation(self, value):
        if value.client != self.context['request'].user and value.listing.property.host != self.context['request'].user:
            raise ValidationError("Invalid reservation to comment on")
        
        if value.status not in ["Terminated", "Completed"]:
            raise ValidationError("Invalid reservation to comment on")
        
        first = True
        for comment in value.listing.property.propertycomment_set.all():
            if comment.reservation == value:
                first = False
                if comment.child == None:
                    if self.context['request'].user == comment.commenter:
                        raise ValidationError("Cannot reply to own reply or comment")
        
        if first and value.listing.property.host == self.context['request'].user:
            raise ValidationError("Cannot comment on own property")
        
        return value
    
    def create(self, validated_data):

        parent = None
        for comment in validated_data['reservation'].listing.property.propertycomment_set.all():
            if comment.reservation == validated_data['reservation']:
                if comment.child == None:
                    parent = comment
                    break
        
        ret = PropertyComment.objects.create(child=None,
                                      reservation=validated_data['reservation'],
                                      property=validated_data['reservation'].listing.property,
                                      description=validated_data['description'],
                                      commenter=self.context['request'].user,
                                      )

        if parent:
            parent.child = ret
            parent.save()
        else:
            ret.is_parent = True
            ret.save()

        if 'rating' in validated_data:
            ret.rating = validated_data['rating']
            ret.save()
            
        return ret

class UserCommentSerializer(ModelSerializer):
    timetag = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = UserComment
        fields = ['id', 'reservation', 'description', 'user', 'rating', 'timetag']
        read_only_fields = ['user', ]


    def validate_reservation(self, value):
        if value.listing.property.host != self.context['request'].user:
            raise ValidationError("Invalid reservation to comment on")
        
        if value.status not in ["Terminated", "Completed"]:
            raise ValidationError("Invalid reservation to comment on")
        
        if value.client.usercomment_set.all().filter(reservation=value):
            raise ValidationError("Already commented this user for this reservation")
        
        return value
    
    def create(self, validated_data):
        
        ret = UserComment.objects.create(
                                      reservation=validated_data['reservation'],
                                      user=validated_data['reservation'].client,
                                      description=validated_data['description'],
                                      rating=validated_data['rating'])

        return ret
    
