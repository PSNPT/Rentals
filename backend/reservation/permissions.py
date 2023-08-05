from rest_framework import permissions

class IsClientOrHost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        return ((obj.listing.property.host == request.user) or (obj.client == request.user))
    
class IsClient(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        return obj.client == request.user

class IsHost(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        return obj.listing.property.host == request.user