from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    ListAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from comment.serializers import UserCommentSerializer
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from .exceptions import TokenError, InvalidToken
from .permissions import HasHosted, IsOwner

class Signup(CreateAPIView):
    permission_classes = []
    serializer_class = CustomUserSerializer

class ProfileDetail(RetrieveAPIView):
    permission_classes = []
    serializer_class = CustomUserSerializer

    def get_object(self):
        return get_object_or_404(CustomUser, id=self.kwargs['id'])
    
class ProfileComments(ListAPIView):
    permission_classes = [IsAuthenticated, HasHosted]
    serializer_class = UserCommentSerializer

    def get_queryset(self):
        obj = get_object_or_404(CustomUser, id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        comments = obj.usercomment_set.all()

        return comments
    
class ProfileEdit(UpdateAPIView):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = CustomUserSerializer

    def get_object(self):
        obj = get_object_or_404(CustomUser, id=self.kwargs['id'])
        self.check_object_permissions(self.request, obj)
        return obj

class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"access": "Removed from local storage", "refresh": "Removed from local storage"})

class UID(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"id": request.user.id})
    












""" 


class CookieTokenObtainPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        response.set_cookie(key="Authorization", value=serializer.validated_data['access'])
        response.set_cookie(key="Authorization", value=serializer.validated_data['access'])
        return response 
        
"""