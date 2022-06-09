from django.urls import path
from .views import SwipeListView, SwipeDetailView

# default path: /swipes/

urlpatterns = [
  path('', SwipeListView.as_view()),
  path('<int:pk>/', SwipeDetailView.as_view())
]