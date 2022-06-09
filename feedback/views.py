from urllib import request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .serializers.common import FeedbackSerializer
from .models import Feedback


# POST /feedback/
# Add a new feedback
class FeedbackListView(APIView):
  permission_classes = (IsAuthenticated, )

  def get(self, _request):
    feedback = Feedback.objects.all()
    serialized_feedback = FeedbackSerializer(feedback, many=True)
    return Response(serialized_feedback.data)

  def post(self, request):
    print('request ->', request.data)
    print('request user id ->', request.user.id)
    request.data['owner'] = request.user.id
    feedback_to_add = FeedbackSerializer(data=request.data)
    try:
      feedback_to_add.is_valid(True)
      feedback_to_add.save()
      return Response(feedback_to_add.data, status.HTTP_201_CREATED)
    except ValidationError:
      return Response(feedback_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
    except Exception as e:
      print(e)
      return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)


# Endpoint: /feedback/:id
# Methods: GET, PUT, DELETE
class FeedbackDetailView(APIView):
  permission_classes = (IsAuthenticated, )

  # CUSTOM FUNCTION
  # Find a specific feedback and make sure it exists
  def get_feedback(self, pk):
    try:
      return Feedback.objects.get(pk=pk)
    except Feedback.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })

  # GET
  def get(self, _request, pk):
    feedback = self.get_feedback(pk)
    print('Feedback -> ', feedback)
    serialized_feedback = FeedbackSerializer(feedback)
    return Response(serialized_feedback.data, status.HTTP_200_OK)

  # PUT
  def put(self, request, pk):
    feedback_to_update = self.get_feedback(pk=pk)

    deserialized_feedback = FeedbackSerializer(instance=feedback_to_update, data=request.data)
    
    try:
      deserialized_feedback.is_valid()
      deserialized_feedback.save()
      return Response(deserialized_feedback.data, status.HTTP_202_ACCEPTED)    
    except Exception as e:
      print(e)
      return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)

  def delete(self, request, pk):
    print ('PK -> ', pk)
    feedback_to_delete = self.get_feedback(pk)
    # print('FEEDBACK OWNER ID -> ', feedback_to_delete.owner)
    print('REQUEST USER ID ->', request.user)
    # if feedback_to_delete.owner != request.user:
    #   print('WE CANNOT DELETE OUR RECORD')
    #   raise PermissionDenied()
    print('WE CAN DELETE OUR RECORD')
    feedback_to_delete.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
