from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet
from .test_views import TestTripView

router = DefaultRouter()
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test-trip/', TestTripView.as_view(), name='test-trip'),
] 