from django.urls import include, path
from .views import ListingBatchView, ListingView, ListingCreate, ListingUpdate, ListingDetail, ListingDestroy, ListingSearch, ListingActiveView, ListingInactiveView
app_name="listing"

urlpatterns = [
    path('all/', ListingView.as_view(), name='all'),
        path('allactive/', ListingActiveView.as_view(), name='allactive'),
            path('allinactive/', ListingInactiveView.as_view(), name='allinactive'),
    path('allbatch/', ListingBatchView.as_view(), name='allbatch'),
    path('create/', ListingCreate.as_view(), name='create'),
    path('<int:id>/update/', ListingUpdate.as_view(), name='update'),
    path('<int:id>/', ListingDetail.as_view(), name='detail'),
    path('<int:id>/destroy/', ListingDestroy.as_view(), name='destroy'),
    path('search/', ListingSearch.as_view(), name='search'),
]