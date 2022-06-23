# this populated serializer inherits the PopulatedProfile serializer

from .common import ProfileSerializer
from swipes.serializers.populated import PopulatedSwipeSerializer, PopulatedSwipeNoSPIDSerializer
from jwt_auth.serializers.common import UserSerializer

# defining populated serializer
class PopulatedProfileSerializer(ProfileSerializer):
  # the populated Profile has all the swipes on that profile, and the full User object for the owner
  owner = UserSerializer()
  swipes = PopulatedSwipeNoSPIDSerializer(many=True)

# This one is the same as the one above, except the owner object isn't populated
class PopulatedProfileSerializerNoOwner(ProfileSerializer):
  # one task in this class is to define our field to populate
  swipes = PopulatedSwipeNoSPIDSerializer(many=True)