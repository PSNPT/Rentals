from rest_framework.serializers import ModelSerializer, CharField
from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

class CustomUserSerializer(ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ["avatar", "first_name", "last_name", "email", "password1", "password2"]

    def validate(self, attrs):
        # PATCH handler
        if 'password1' not in attrs.keys():
            # No password change requested
            return attrs
        
        if 'password2' not in attrs.keys():
            raise serializers.ValidationError({"password1": "Password fields didn't match."})
            return attrs
        
        # POST or PATCH
        if attrs['password1'] != attrs['password2']:
                raise serializers.ValidationError({"password1": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):

        if 'avatar' in validated_data:

            user = CustomUser.objects.create_user(
                avatar=validated_data['avatar'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                email=validated_data['email'],
                password=validated_data['password1']
            )

        else:
            user = CustomUser.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password1']
            )

        return user
    
    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if 'password1' in validated_data.keys() and 'password2' in validated_data.keys():
            instance.set_password(validated_data['password1'])

        instance.save()

        return instance