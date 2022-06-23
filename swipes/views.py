from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .serializers.common import SwipeSerializer
from .serializers.populated import PopulatedSwipeSerializer
from .models import Swipe

from profiles.models import Profile
from profiles.serializers.common import ProfileSerializer
from profiles.serializers.populated import PopulatedProfileSerializer
from matches.serializers.common import MatchSerializer

from jwt_auth.serializers.populated import PopulatedUserSerializer
from django.contrib.auth import get_user_model
User = get_user_model()



# GET, POST : /swipes/
class SwipeListView(APIView):
  permission_classes = (IsAuthenticated, )
  
  # CUSTOM FUNCTIONS
  # Find a specific profile and make sure it exists
  def get_profile(self, pk):
    try:
      return Profile.objects.get(pk=pk)
    except Profile.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })

  # Find a specific user and make sure it exists
  def get_user(self, pk):
    try:
      return User.objects.get(pk=pk)
    except User.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })

  # Find a specific swipe and make sure it exists
  def get_swipe(self, pk):
    try:
      return Swipe.objects.get(pk=pk)
    except Swipe.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })


  # GET all swipes
  def get(self, _request):
    swipes = Swipe.objects.all()
    serialized_swipes = PopulatedSwipeSerializer(swipes, many=True)
    return Response(serialized_swipes.data)


  # POST a swipe
  # Also add a match if the swipe garners a match
  def post(self, request):
    # print('request ->', request.data)
    # print('request user ->', request.user)
    # print('request user id ->', request.user.id)

    swipe_data = request.data

    # If it's a right swipe, check to see if it's a match
    # Add the match if it's a new one
    if swipe_data['right_swipe']:

      # GET Owner of swiped profile
      swiped_profile_id = swipe_data['swiped_profile_id']
      profile = self.get_profile(swiped_profile_id)
      profile_owner_id = profile.owner.id

      # Check to see if the two have already matched
      swiper = self.get_user(swipe_data['swiper_id']) # get user id for swiper
      serialized_swiper = PopulatedUserSerializer(swiper)
      serialized_swiper_matches = serialized_swiper['matches'] # get matches for swiper
      # print('serialized swiper matches value ->', serialized_swiper_matches.value)

      def check_already_matched (match_item):
        first_matched_user = match_item['matched_users'][0]['id']
        second_matched_user = match_item['matched_users'][1]['id']
        if profile_owner_id == first_matched_user or profile_owner_id == second_matched_user:
          return True
        else:
          return False
      
      matched_list = list(filter(check_already_matched, serialized_swiper_matches.value))
      print("matched list length -> ", len(matched_list))

      # If the match list is zero, then the two users have not matched
      # The next step is to check the swipes of the owner of the swiped profile to see if that user has made any right swipes on any of the swiper's profiles
      if len(matched_list) == 0:
        
        swiped_user = self.get_user(profile_owner_id)
        serialized_swiped_user = PopulatedUserSerializer(swiped_user)
        swiped_user_swipes = serialized_swiped_user['swipes']
        
        # Checks to see if the current swipe garners a match
        def check_match_exists(swipe):
          print('is right swipe ->', swipe['right_swipe'])

          # If it's a right swipe, check to see if the swiped profile owner matches the swiper's user id
          if swipe['right_swipe']:
            swipe_profile = self.get_profile(swipe['swiped_profile_id']['id'])
            swipe_profile_owner_id = swipe_profile.owner.id
            print('swipe profile owner id ->', swipe_profile_owner_id)
            print('request user id ->', swipe_data['swiper_id'])
            
            if swipe_profile_owner_id == swipe_data['swiper_id']:
              print("TRUE RUNS")
              return True
            else:
              print("FALSE RUNS")
              return False
          else:
            return False

        match_swipes = list(filter(check_match_exists, swiped_user_swipes.value))
        print('match swipes length ->', len(match_swipes))

        # If a match should be created, this will run
        if len(match_swipes) > 0:
          exchange_social = False

          # Check to see if it's a social media match
          if serialized_swiped_user['give_social'].value & serialized_swiper['give_social'].value:
            exchange_social = True

          match_data = {
            'exchange_social_media': exchange_social,
            'matched_users': [profile_owner_id, swipe_data['swiper_id']]
          }

          # Add new match
          match_to_add = MatchSerializer(data=match_data)
          match_to_add.is_valid()
          print(match_to_add.errors)
          match_to_add.save()
          print('MATCH WAS ADDED!!!')

    # Posting the swipe
    swipe_to_add = SwipeSerializer(data=request.data)
    # print('swipe to add ->', swipe_to_add)
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
  # retrieving, modifiying, and deleting single swipes requires authentication
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

    deserialized_swipe = SwipeSerializer(instance=swipe_to_update, data=request.data, partial=True)
    
    # print('SWIPE OWNER ID -> ', deserialized_swipe.swiper_id)
    # print('REQUEST USER ID ->', request.user)
    # if deserialized_swipe.swiper_id != request.user:
    #   print('WE CANNOT UPDATE OUR RECORD')
    #   raise PermissionDenied()
    # print('WE CAN UPDATE OUR RECORD')

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
    
    # print('SWIPE OWNER ID -> ', swipe_to_delete.swiper_id)
    # print('REQUEST USER ID ->', request.user)
    # if swipe_to_delete.swiper_id != request.user:
    #   print('WE CANNOT DELETE OUR RECORD')
    #   raise PermissionDenied()
    # print('WE CAN DELETE OUR RECORD')

    swipe_to_delete.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)