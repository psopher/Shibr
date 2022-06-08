from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Feedback(models.Model):
  right_swipe = models.BooleanField(default=False)
  best_image = models.CharField(max_length=300, default="https://res.cloudinary.com/drgegagha/image/upload/v1654722349/shibr/no-good-images_ttpmrv.png")
  best_image_comments = ArrayField(
      models.CharField(max_length=30, blank=True),
      size=20,
  )
  worst_image = models.CharField(max_length=300, default="https://res.cloudinary.com/drgegagha/image/upload/v1654722349/shibr/no-bad-images_uqs6qe.png")
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