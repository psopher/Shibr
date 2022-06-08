# BasicAuthentication is the base class that we will inherit as our auth class, and will overwrite default behavior by using the authentication method
from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
User = get_user_model()

# import settings
from django.conf import settings

# jwt
import jwt 

class JWTAuthentication(BasicAuthentication):
  
  # authenticate method overrides default authentication
  def authenticate(self, request):
    # ensure authorization header exists
    header = request.headers.get('Authorization')

    # check that the header exists
    if not header:
      return None

    # check that the token is the right format, i.e. starts with Bearer
    if not header.startswith('Bearer'):
      raise PermissionDenied(detail="Auth token is invalid")

    # Remove "Bearer" from the beginning
    token = header.replace('Bearer ', '')

    try:
      # decoding the token passed by the user
      # first argument is token with bearer removed
      # second argument is the secret
      # third argument is the algorithm (needed here but not in mongo)
      payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

      # use payload to query User model
      user = User.objects.get(pk=payload.get('sub'))

    # invalid token exception
    except jwt.exceptions.InvalidTokenError:
      raise PermissionDenied(detail="Invalid token")

    # payload sub doesn't match pk
    except User.DoesNotExist:
      raise PermissionDenied(detail="User not found")

    # if it gets to this point then the user is authenticated
    # authenticate method requires us to return at two-tuple of (user, auth)

    return (user, token)