
from rest_framework.serializers import ModelSerializer, CharField, ValidationError, HyperlinkedModelSerializer
from accounts.models import CustomUser
from .models import Property, Amenity, Accessibility, Image
from rest_framework import serializers
import os


class AmenitySerializer(ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'

class AccessibilitySerializer(ModelSerializer):
    class Meta:
        model = Accessibility
        fields = '__all__'

class ImageSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

class PropertySerializer(ModelSerializer):
    #imagedetails = ImageSerializer(required=False, read_only=True, source='image_set', many=True)
    #typedetails = HouseTypeSerializer(required=False, read_only=True, source='type')
    #accessibilitydetails = AccessibilitySerializer(required=False, read_only=True, source='accessibility', many=True)
    #amenitiesdetails = AmenitySerializer(required=False, read_only=True, source='amenity', many=True)

    images = serializers.ListField(
        child = serializers.FileField(max_length = 1000000, allow_empty_file = False, use_url = False),
        write_only = True
    )

    class Meta:
        model = Property
        fields = ['url', 'is_active', 'id', 'name', 'location', 'accessibility', 'amenities',  'bed', 'bath', 'parking', 'occupancy', 'description', 'host', 'images', 'image_set']
        #fields += ['typedetails', 'accessibilitydetails', 'amenitiesdetails', 'imagedetails']
        read_only_fields = ['image_set', 'host', 'is_active']
        extra_kwargs = {
                    'url': {'view_name': 'property:detail', 'lookup_field': 'id', 'lookup_url_kwarg': 'id'}
                }
        
        
    def create(self, validated_data):
        property = Property.objects.create(name=validated_data['name'],
                                           location=validated_data['location'],                                           
                                           bed=validated_data['bed'],
                                           bath=validated_data['bath'],
                                           parking=validated_data['parking'],
                                           occupancy=validated_data['occupancy'],
                                           description=validated_data['description'],
                                           host=self.context['request'].user)

        for image in validated_data['images']:
            temp = Image.objects.create(property=property)
            temp.img.save(image.name, image.file, save=True)

        for tag in validated_data['accessibility']:
            property.accessibility.add(tag)

        for tag in validated_data['amenities']:
            property.amenities.add(tag)
            
        return property



    def update(self, instance, validated_data):
        if 'images' in validated_data.keys() and validated_data['images']:
            base = os.path.join('./media/property/', str(instance.id))
            entries = os.listdir(base)
            for entry in entries:
                if os.path.isfile(os.path.join(base, entry)):
                    os.remove(os.path.join(base, entry))

        if 'images' in validated_data.keys():

            for image in instance.image_set.all():
                image.delete()

            for image in validated_data['images']:
                temp = Image.objects.create(property=instance)
                temp.img.save(image.name, image.file, save=True)

        return super().update(instance, validated_data)