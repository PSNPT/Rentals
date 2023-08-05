from django.urls import include, path
from .views import PropertyCommentCreate, UserCommentCreate
app_name="comment"

urlpatterns = [
    path('property/', PropertyCommentCreate.as_view(), name='property'),
    path('user/', UserCommentCreate.as_view(), name='user'),
]