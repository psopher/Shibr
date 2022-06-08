from django.urls import path
from .views import ProfileListView, ProfileDetailView

#any request getting through to this point is prefixed with the /profiles/ endpoint

# example: http://localhost/profiles/
# id example: http://localhost/profiles/:pk/

urlpatterns = [
  path('', ProfileListView.as_view()),
  path('<int:pk>/', ProfileDetailView.as_view()) 
  # this is known as a captured value 
  # on the left is a path converter. Here we've specified a type of int
  # this isn't needed and we could write <pk>, but we're being more specific about the type we're expecting

]