# this populated serializer inherits the PopulatedProfile serializer

from .common import ProfileSerializer
from swipes.serializers.populated import PopulatedSwipeSerializer, PopulatedSwipeNoSPIDSerializer
from jwt_auth.serializers.common import UserSerializer

# defining populated serializer
class PopulatedProfileSerializer(ProfileSerializer):
  # one task in this class is to define our field to populate
  owner = UserSerializer()
  swipes = PopulatedSwipeNoSPIDSerializer(many=True)

class PopulatedProfileSerializerNoOwner(ProfileSerializer):
  # one task in this class is to define our field to populate
  swipes = PopulatedSwipeNoSPIDSerializer(many=True)