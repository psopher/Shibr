#rest_framework imports
from psycopg2 import IntegrityError
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from django.template import loader

# custom imports
from .models import Profile # model will be used to query the db
from .serializers.common import ProfileSerializer
from .serializers.populated import PopulatedProfileSerializer

# import permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProfileListView(APIView):
  permission_classes = (IsAuthenticatedOrReadOnly, ) # one-tuple requires trailing comma


  # ENDPOINTS & METHODS:
  # GET /profiles/
  # POST /profiles/

  # GET — Returns all profiles
  def get(self, _request):
    # in this controller we want to get all the items inside the profiles table and return it as a response
    # get all objects using all() method
    profiles = Profile.objects.all()
    serialized_profiles = PopulatedProfileSerializer(profiles, many=True)
    print('searlized data ->', serialized_profiles.data)
    # print('PROFILES ->', profiles())
    return Response(serialized_profiles.data, status=status.HTTP_200_OK)

  # POST — Add a new profile to the db
  # All posts requires the trailing '/' in the /profiles/ endpoint
  def post(self, request):
    # to get the request body, we use the data key on the request object
    # this process of passing python into a serializer to convert to a QuerySet is known as deserialization
    deserialized_profile = ProfileSerializer(data=request.data)
    # serializers give us methods to check validity of the data being passed into the database
    # checks the model, makes sure it passes validation
    # method we use is is_valid -> raises an exception if not valid
    try:
      deserialized_profile.is_valid()
      # if we get to this point, validation has passed. If is_valid fails, it will throw an exception
      deserialized_profile.save()
      # If we get to this point, the record has been saved
      # When saving, a data key is added that contains a python copy of the record that has been created
      return Response(deserialized_profile.data, status.HTTP_201_CREATED)
    except Exception as e:
      print(type(e))
      print(e)
      return Response( {'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)

class ProfileDetailView(APIView):
  permission_classes = (IsAuthenticatedOrReadOnly, ) # one-tuple requires trailing comma

  # CUSTOM FUNCTION
  # Find a specific profile and make sure it exists
  def get_profile(self, pk):
    try:
      # pk = is us detailing that we want to look in whatever column is the primary key column
      # the second pk is the captured value
      # this is the same as saying in SQL: WHERE id = 1
      return Profile.objects.get(pk=pk)
    except Profile.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })

  # GET - Return 1 item from the profiles table
  def get(self, _request, pk):
    profile = self.get_profile(pk)
    print('Profile -> ', profile)
    serialized_profile = PopulatedProfileSerializer(profile)
    return Response(serialized_profile.data, status.HTTP_200_OK)


  # PUT - Update 1 item from the profiles table
  def put(self, request, pk):
      profile_to_update = self.get_profile(pk=pk)

      print('PROFILE OWNER ID -> ', profile_to_update.owner)
      print('REQUEST USER ID ->', request.user)
      if profile_to_update.owner != request.user:
        print('WE CANNOT UPDATE OUR RECORD')
        raise PermissionDenied()
      print('WE CAN UPDATE OUR RECORD')

      deserialized_profile = ProfileSerializer(instance=profile_to_update, data=request.data)
      
      try:
        deserialized_profile.is_valid()
        print(deserialized_profile.errors)

        deserialized_profile.save()
        return Response(deserialized_profile.data, status.HTTP_202_ACCEPTED)    
      except Exception as e:
        print(e)
        return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)



  # DELETE - Remove 1 item from the profiles table
  # Take the pk from the data capture and find the profile to delete
  def delete(self, request, pk):
    profile_to_delete = self.get_profile(pk)
    print('PROFILE OWNER ID -> ', profile_to_delete.owner)
    print('REQUEST USER ID ->', request.user)
    if profile_to_delete.owner != request.user:
      print('WE CANNOT DELETE OUR RECORD')
      raise PermissionDenied()
    print('WE CAN DELETE OUR RECORD')
    profile_to_delete.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)


