import os
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from accounts.models import CustomUser
from notification.models import Notification
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .permissions import IsOwner
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
import datetime
from rest_framework.serializers import ModelSerializer, CharField, ValidationError

class NotificationDetail(RetrieveAPIView):
    permission_classes = [IsAuthenticated & IsOwner]
    serializer_class = NotificationSerializer

    def get_object(self):
        obj = get_object_or_404(Notification, id=self.kwargs['id'], read=False)
        self.check_object_permissions(self.request, obj)

        obj.read = True
        obj.save()
        
        return obj

class NotificationView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user, read=False)