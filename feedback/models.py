from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Feedback(models.Model):
  
  # Feedback
  best_image_index = models.IntegerField(default=None)
  best_image_comments = ArrayField(
      models.CharField(max_length=30, blank=True),
      size=20,
  )
  worst_image_index = models.IntegerField(default=None)
  worst_image_comments = ArrayField(
      models.CharField(max_length=30, blank=True),
      size=20,
  )
  bio_overall = models.CharField(max_length=30, default=None)
  bio_good_comments = ArrayField(
      models.CharField(max_length=30, blank=True),
      size=20,
  )
  bio_bad_comments = ArrayField(
      models.CharField(max_length=30, blank=True),
      size=20,
  )

  # Relationship Fields
  swipe_id = models.ForeignKey(
    'swipes.Swipe',
    related_name='feedback',
    on_delete=models.CASCADE,
    blank=True,
    null=True
  )