from django.urls import include, path
from .views import ReservationCreate, ReservationDetail, ReservationDestroy, ReservationApprove, ReservationSearch
app_name="reservation"

urlpatterns = [
    path('create/', ReservationCreate.as_view(), name='create'),
    path('<int:id>/', ReservationDetail.as_view(), name='detail'),
    path('<int:id>/cancel/', ReservationDestroy.as_view(), name='cancel'),
    path('<int:id>/approve/', ReservationApprove.as_view(), name='approve'),  
    path('all/', ReservationSearch.as_view(), name='all'), 
]