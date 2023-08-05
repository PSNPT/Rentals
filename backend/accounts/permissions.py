from rest_framework import permissions

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        return obj == request.user
    

class HasHosted(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        for reservation in obj.reservation_set.all():
            if reservation.listing.property.host == request.user:
                return True
        return False