import os
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from notification.models import Notification
from .models import Reservation
from .serializers import PropertyCommentSerializer, UserCommentSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
#from .permissions import IsClientOrHost, IsClient, IsHost
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
import datetime
from rest_framework.serializers import ModelSerializer, CharField, ValidationError

class PropertyCommentCreate(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertyCommentSerializer

class UserCommentCreate(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCommentSerializer

class PropertyCommentDetail(RetrieveAPIView):
    permission_classes = []
    serializer_class = PropertyCommentSerializer
    paginator = None

    def get_object(self):
        obj = get_object_or_404(HouseType, id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        return obj
    
class UserCommentDetail(RetrieveAPIView):
    permission_classes = []
    serializer_class = UserCommentSerializer
    paginator = None

    def get_object(self):
        obj = get_object_or_404(HouseType, id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        return obj