from django.db import models

# Create your models here.
class Match(models.Model):

  # Match Data
  exchange_social_media = models.BooleanField(default=False)

  # Relationship Fields
  matched_users = models.ManyToManyField(
    'jwt_auth.User',
    related_name='matches',
    blank=True
  )