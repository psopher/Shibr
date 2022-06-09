# this populated serializer inherits the PopulatedProfile serializer

from .common import ProfileSerializer
from swipes.serializers.populated import PopulatedSwipeSerializer
from jwt_auth.serializers.common import UserSerializer

# defining populated serializer
class PopulatedProfileSerializer(ProfileSerializer):
  # one task in this class is to define our field to populate
  owner = UserSerializer()
  swipes = PopulatedSwipeSerializer(many=True)