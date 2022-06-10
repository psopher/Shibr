# this populated serializer inherits the Match serializer

from .common import MatchSerializer
from swipes.serializers.common import SwipeSerializer
from swipes.serializers.populated import PopulatedSwipeSerializer
from jwt_auth.serializers.common import UserSerializer

# defining populated serializer
class PopulatedMatchSerializer(MatchSerializer):
  # one task in this class is to define our field to populate
  swipes = SwipeSerializer(many=True)
  matched_users = UserSerializer(many=True)