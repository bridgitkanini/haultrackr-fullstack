from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Trip

class TestTripView(APIView):
    """
    A simple test view to verify if we can create a trip.
    """
    def get(self, request, format=None):
        try:
            # Try to create a test trip
            trip = Trip.objects.create(
                current_location="Test Location",
                pickup_location="Test Pickup",
                dropoff_location="Test Dropoff",
                current_cycle_hours=0
            )
            return Response({"status": "success", "trip_id": trip.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
