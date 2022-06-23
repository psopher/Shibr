from django.forms import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from datetime import datetime, timedelta # create timestamps in different formats
from django.conf import settings
import jwt
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated

from .serializers.common import UserSerializer
from .serializers.common import UserSettingsSerializer
from .serializers.populated import PopulatedUserSerializer

from django.contrib.auth import get_user_model
User = get_user_model()

# POST
# Endpoint: /register
class RegisterView(APIView):

  def post(self, request):
    print('REQUEST BODY -> ', request.data)
    user_to_add = UserSerializer(data=request.data)

    try:
      user_to_add.is_valid(True)
      # print(user_to_add.errors)
      user_to_add.save()
      return Response({ 'message': 'Registration Successful'})
    except ValidationError:
      return Response(user_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
    except Exception as e:
      print(type(e))
      print(e)
      return Response({ 'detail': str(e)}, status.HTTP_422_UNPROCESSABLE_ENTITY)
    
# POST
# Endpoint: /login
class LoginView(APIView):
  def post(self, request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
      # search for user by the email field
      user_to_validate = User.objects.get(email=email)
    except User.DoesNotExist:
      raise PermissionDenied('Invalid credentials')

    # If we get here then a user was found in the db matching the email
    # We need to check the plain text password against the stored hashed password
    if not user_to_validate.check_password(password):
      raise PermissionDenied('Invalid credentials')

    # If we get here then the user is verified
    # At this point, we want to create a token
    # timedelta specifies the expiration date for the token
    dt = datetime.now() + timedelta(days=3)

    # building our token
    token = jwt.encode(
      {
        'sub': user_to_validate.id,
        'exp': int(dt.strftime('%s')),
        'email': email,
        'username': email.split(':')[0]
      },
      settings.SECRET_KEY,
      algorithm='HS256'
    )
    
    return Response({ 'message': f"Welcome back, {user_to_validate.username}", 'token': token }, status.HTTP_202_ACCEPTED)


# GET : /users/
class UserListView(APIView):
  # Must be authenticated to all users
  permission_classes = (IsAuthenticated, )

  def get(self, _request):
    users = User.objects.all()
    serialized_users = PopulatedUserSerializer(users, many=True)
    return Response(serialized_users.data)



# Endpoint: /users/:id
# Methods: GET, PUT, DELETE
class UserDetailView(APIView):
  # Must be authenticated to retrieve, modify, or delete a user
  permission_classes = (IsAuthenticated, )

  # CUSTOM FUNCTION
  # Find a specific user and make sure it exists
  def get_user(self, pk):
    try:
      return User.objects.get(pk=pk)
    except User.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })

  # GET
  def get(self, _request, pk):
    user = self.get_user(pk)
    print('User -> ', user)
    serialized_user = PopulatedUserSerializer(user)
    return Response(serialized_user.data, status.HTTP_200_OK)

  # PUT
  def put(self, request, pk):
    user_to_update = self.get_user(pk=pk)

    # Partial = true and using the serializer that doesn't include validation is important for being able to modify a user without inputting the password and password_confirmation
    deserialized_user = UserSettingsSerializer(instance=user_to_update, data=request.data, partial=True)
    
    try:
      deserialized_user.is_valid()
      print(deserialized_user.errors)
      deserialized_user.save()
      return Response(deserialized_user.data, status.HTTP_202_ACCEPTED)    
    except Exception as e:
      print(e)
      return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)


  # DELETE
  def delete(self, request, pk):
    print ('PK -> ', pk)
    user_to_delete = self.get_user(pk)
    # print('USER OWNER ID -> ', user_to_delete.owner)
    # print('REQUEST USER ID ->', request.user)
    # if user_to_delete.owner != request.user:
    #   print('WE CANNOT DELETE OUR RECORD')
    #   raise PermissionDenied()
    # print('WE CAN DELETE OUR RECORD')
    user_to_delete.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)