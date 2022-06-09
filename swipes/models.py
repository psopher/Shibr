from django.db import models

# Create your models here.
class Swipe(models.Model):

  # Swipe Data
  right_swipe = models.BooleanField(default=False)
  is_match = models.BooleanField(default=False)
  exchange_social_media = models.BooleanField(default=False)

  # Relationship Fields
  swiper_id = models.ForeignKey(
    'jwt_auth.User',
    related_name='swipes',
    on_delete=models.CASCADE,
    blank=True,
    null=True
  )
  swiped_profile_id = models.ForeignKey(
    'profiles.Profile',
    related_name='swipes',
    on_delete=models.CASCADE,
    blank=True,
    null=True
  )
  