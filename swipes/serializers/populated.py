# this populated serializer inherits the PopulatedSwipe serializer

from .common import SwipeSerializer
from profiles.serializers.common import ProfileSerializer
from jwt_auth.serializers.common import UserSerializer

# defining populated serializer
class PopulatedSwipeSerializer(SwipeSerializer):
  # one task in this class is to define our field to populate
  swiper_id = UserSerializer()
  swiped_profile_id = ProfileSerializer()