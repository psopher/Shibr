# this populated serializer inherits the Match serializer

from .common import MatchSerializer
from jwt_auth.serializers.common import UserSerializer

# defining populated serializer
class PopulatedMatchSerializer(MatchSerializer):
  # one task in this class is to define our field to populate
  matched_users = UserSerializer(many=True)