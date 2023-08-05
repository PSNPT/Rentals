from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from django.urls import include, path

app_name="accounts"

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('UID/', views.UID.as_view(), name='UID'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('signup/', views.Signup.as_view(), name='signup'),
    path('logout/', views.Logout.as_view(), name='logout'),
    path('<int:id>/', views.ProfileDetail.as_view(), name='profiledetail'),
    path('<int:id>/edit/', views.ProfileEdit.as_view(), name='profileedit'),
    path('<int:id>/comments/', views.ProfileComments.as_view(), name='profilecomments'), 
]
