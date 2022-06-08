from django.urls import path
from .views import FeedbackListView, FeedbackDetailView

# default path: /feedback/

urlpatterns = [
  path('', FeedbackListView.as_view()),
  path('<int:pk>/', FeedbackDetailView.as_view())
]