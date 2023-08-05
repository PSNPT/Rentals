from django.urls import include, path
from .views import AccessibilityView, AmenitiesView, CommentsBatchView, ImageView, PropertyActivate, PropertyActiveView, PropertyBatchView, PropertyInactiveView, PropertyView, PropertyCreate, PropertyUpdate, PropertyDetail, PropertyDestroy, PropertyComments
app_name="property"

urlpatterns = [
    path('all/', PropertyView.as_view(), name='all'),
    path('create/', PropertyCreate.as_view(), name='create'),
    path('<int:id>/update/', PropertyUpdate.as_view(), name='update'),
    path('<int:id>/', PropertyDetail.as_view(), name='detail'),
    path('<int:id>/destroy/', PropertyDestroy.as_view(), name='destroy'),
    path('<int:id>/comments/', PropertyComments.as_view(), name='comments'),
    path('amenities/', AmenitiesView.as_view(), name='amenities'),
    path('accessibility/', AccessibilityView.as_view(), name='accesibility'),
    path('images/', ImageView.as_view(), name='images'),
    path('<int:id>/commentsbatch/', CommentsBatchView.as_view(), name='commentsbatch'),
    path('allbatch/', PropertyBatchView.as_view(), name='allbatch'),
    path('allactive/', PropertyActiveView.as_view(), name='allactive'),
    path('allinactive/', PropertyInactiveView.as_view(), name='allinactive'),
    path('<int:id>/reactivate/', PropertyActivate.as_view(), name='activate'),
]