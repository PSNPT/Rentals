from django.urls import include, path
from .views import NotificationView, NotificationDetail
app_name="notification"

urlpatterns = [
    path('all/', NotificationView.as_view(), name='all'),
    path('<int:id>/', NotificationDetail.as_view(), name='detail'),
]