# this populated serializer inherits the PopulatedUser serializer

from .common import UserSerializer
from profiles.serializers.populated import PopulatedProfileSerializer, PopulatedProfileSerializerNoOwner
from swipes.serializers.populated import PopulatedSwipeSerializer, PopulatedSwipeNoSIDSerializer
from matches.serializers.common import MatchSerializer
from matches.serializers.populated import PopulatedMatchSerializer

# User model
from django.contrib.auth import get_user_model
User = get_user_model()

# defining populated serializer
class PopulatedUserSerializer(UserSerializer):
  # Each populated user object contains all the profiles the user created, all the swipes the user made, and all the matches the user has
  profiles = PopulatedProfileSerializerNoOwner(many=True)
  swipes = PopulatedSwipeNoSIDSerializer(many=True)
  matches = PopulatedMatchSerializer(many=True)

  class Meta:
    model = User
    # fields = '__all__'
    fields = (
      'id', 
      'profiles', 
      'swipes', 
      'matches', 
      'password',
      'password_confirmation',
      'email', 
      'username', 
      'profile_image', 
      'karma', 
      'interested_in', 
      'min_age', 
      'max_age', 
      'show_me', 
      'give_social', 
      'ig', 
      'sc', 
      'tw', 
      'current_profile'
    )