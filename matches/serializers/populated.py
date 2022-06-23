# this populated serializer inherits the Match serializer

from .common import MatchSerializer
from jwt_auth.serializers.common import UserSerializer

# defining populated serializer
class PopulatedMatchSerializer(MatchSerializer):
  # the populated Match model includes the User objects of both matched users
  matched_users = UserSerializer(many=True)