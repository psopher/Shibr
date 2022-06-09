# this populated serializer inherits the PopulatedUser serializer

from .common import UserSerializer
from profiles.serializers.populated import PopulatedProfileSerializer
from swipes.serializers.populated import PopulatedSwipeSerializer

# defining populated serializer
class PopulatedUserSerializer(UserSerializer):
  # one task in this class is to define our field to populate
  profiles = PopulatedProfileSerializer(many=True)
  swipes = PopulatedSwipeSerializer(many=True)