from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

from .serializers.common import SwipeSerializer
# from .serializers.populated import PopulatedSwipeSerializer
from .models import Swipe

# GET: /swipes/
class SwipeListView(APIView):
  def get(self, _request):
    swipes = Swipe.objects.all()
    serialized_swipes = SwipeSerializer(swipes, many=True)
    return Response(serialized_swipes.data)
