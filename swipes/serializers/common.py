from rest_framework import serializers
from ..models import Swipe

# define our own serializer class
class SwipeSerializer(serializers.ModelSerializer):
  # define a Meta subclass that details which model and fields you want to serialize
  class Meta:
    model = Swipe # define model to serialize from
    fields = '__all__' # fields can be a tuple of field names or __all__ to get all fields
    