from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .serializers.common import SwipeSerializer
from .serializers.populated import PopulatedSwipeSerializer
from .models import Swipe

# GET, POST : /swipes/
class SwipeListView(APIView):
  permission_classes = (IsAuthenticated, )


  def get(self, _request):
    swipes = Swipe.objects.all()
    serialized_swipes = PopulatedSwipeSerializer(swipes, many=True)
    return Response(serialized_swipes.data)

  def post(self, request):
    print('request ->', request.data)
    print('request user id ->', request.user.id)
    request.data['owner'] = request.user.id
    swipe_to_add = SwipeSerializer(data=request.data)
    try:
      swipe_to_add.is_valid(True)
      swipe_to_add.save()
      return Response(swipe_to_add.data, status.HTTP_201_CREATED)
    except ValidationError:
      return Response(swipe_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
    except Exception as e:
      print(e)
      return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)


# Endpoint: /swipes/:id
# Methods: GET, PUT, DELETE
class SwipeDetailView(APIView):
  permission_classes = (IsAuthenticated, )

  # CUSTOM FUNCTION
  # Find a specific swipe and make sure it exists
  def get_swipe(self, pk):
    try:
      return Swipe.objects.get(pk=pk)
    except Swipe.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })

  # GET
  def get(self, _request, pk):
    swipe = self.get_swipe(pk)
    print('Swipe -> ', swipe)
    serialized_swipe = PopulatedSwipeSerializer(swipe)
    return Response(serialized_swipe.data, status.HTTP_200_OK)

  # PUT
  def put(self, request, pk):
    swipe_to_update = self.get_swipe(pk=pk)

    deserialized_swipe = SwipeSerializer(instance=swipe_to_update, data=request.data)
    
    print('SWIPE OWNER ID -> ', deserialized_swipe.swiper_id)
    print('REQUEST USER ID ->', request.user)
    if deserialized_swipe.swiper_id != request.user:
      print('WE CANNOT UPDATE OUR RECORD')
      raise PermissionDenied()
    print('WE CAN UPDATE OUR RECORD')

    try:
      deserialized_swipe.is_valid()
      deserialized_swipe.save()
      return Response(deserialized_swipe.data, status.HTTP_202_ACCEPTED)    
    except Exception as e:
      print(e)
      return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)


  # DELETE
  def delete(self, request, pk):
    print ('PK -> ', pk)
    swipe_to_delete = self.get_swipe(pk)
    
    print('SWIPE OWNER ID -> ', swipe_to_delete.swiper_id)
    print('REQUEST USER ID ->', request.user)
    if swipe_to_delete.swiper_id != request.user:
      print('WE CANNOT DELETE OUR RECORD')
      raise PermissionDenied()
    print('WE CAN DELETE OUR RECORD')

    swipe_to_delete.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)