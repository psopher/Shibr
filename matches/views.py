from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .serializers.common import MatchSerializer
from .serializers.populated import PopulatedMatchSerializer
from .models import Match

# GET, POST : /matches/
class MatchListView(APIView):
  permission_classes = (IsAuthenticated, )


  def get(self, _request):
    matches = Match.objects.all()
    serialized_matches = PopulatedMatchSerializer(matches, many=True)
    return Response(serialized_matches.data)

  def post(self, request):
    print('request ->', request.data)
    print('request user id ->', request.user.id)
    request.data['owner'] = request.user.id
    match_to_add = MatchSerializer(data=request.data)
    try:
      match_to_add.is_valid(True)
      match_to_add.save()
      return Response(match_to_add.data, status.HTTP_201_CREATED)
    except ValidationError:
      return Response(match_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
    except Exception as e:
      print(e)
      return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)


# Endpoint: /matches/:id
# Methods: GET, PUT, DELETE
class MatchDetailView(APIView):
  permission_classes = (IsAuthenticated, )

  # CUSTOM FUNCTION
  # Find a specific match and make sure it exists
  def get_match(self, pk):
    try:
      return Match.objects.get(pk=pk)
    except Match.DoesNotExist as e:
      print(e)
      raise NotFound({ 'detail': str(e) })

  # GET
  def get(self, _request, pk):
    match = self.get_match(pk)
    print('Match -> ', match)
    serialized_match = PopulatedMatchSerializer(match)
    return Response(serialized_match.data, status.HTTP_200_OK)

  # PUT
  def put(self, request, pk):
    match_to_update = self.get_match(pk=pk)

    deserialized_match = MatchSerializer(instance=match_to_update, data=request.data)

    try:
      deserialized_match.is_valid()
      deserialized_match.save()
      return Response(deserialized_match.data, status.HTTP_202_ACCEPTED)    
    except Exception as e:
      print(e)
      return Response({ 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)


  # DELETE
  def delete(self, request, pk):
    print ('PK -> ', pk)
    match_to_delete = self.get_match(pk)

    match_to_delete.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)