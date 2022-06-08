from django.db import models

# Create your models here.
class Swipe(models.Model):
  swiper_id = models.PositiveIntegerField(default=None)
  swiped_profile_id = models.PositiveIntegerField(default=None)
  right_swipe = models.BooleanField(default=False)
  is_match = models.BooleanField(default=False)
  exchange_social_media = models.BooleanField(default=False)