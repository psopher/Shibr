from django.urls import path
from .views import SwipeListView

# default path: /swipes/

urlpatterns = [
  path('', SwipeListView.as_view())
]