# this populated serializer inherits the PopulatedSwipe serializer

from .common import SwipeSerializer
from profiles.serializers.common import ProfileSerializer
from jwt_auth.serializers.common import UserSerializer
from feedback.serializers.common import FeedbackSerializer

# defining populated serializer
# populating both the swiped profile and the swiper profile
class PopulatedSwipeSerializer(SwipeSerializer):
  # one task in this class is to define our field to populate
  swiper_id = UserSerializer()
  swiped_profile_id = ProfileSerializer()
  feedback = FeedbackSerializer(many=True)

# without populated swiper profile
class PopulatedSwipeNoSIDSerializer(SwipeSerializer):
  # one task in this class is to define our field to populate
  # swiper_id = UserSerializer()
  swiped_profile_id = ProfileSerializer()
  feedback = FeedbackSerializer(many=True)

# Without populated swiped profile
class PopulatedSwipeNoSPIDSerializer(SwipeSerializer):
  # one task in this class is to define our field to populate
  swiper_id = UserSerializer()
  # swiped_profile_id = ProfileSerializer()
  feedback = FeedbackSerializer(many=True)