from django.db import models
from django.contrib.auth.models import AbstractUser 
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class User(AbstractUser):
  
  # Auth
  username = models.CharField(max_length=50, unique=True)
  email = models.CharField(max_length=50, unique=True)

  # User Settings
  profile_image = models.CharField(max_length=300, default="https://res.cloudinary.com/drgegagha/image/upload/v1654545117/shibr/image-b-large_in19xb.png")
  karma = models.PositiveIntegerField(default=0)
  interested_in = models.CharField(max_length=30, blank=True)
  min_age = models.PositiveIntegerField(default=0)
  max_age = models.PositiveIntegerField(default=20)
  show_me = models.BooleanField(default=False)
  give_social = models.BooleanField(default=False)
  ig = models.CharField(max_length=30, blank=True)
  sc = models.CharField(max_length=30, blank=True)
  tw = models.CharField(max_length=30, blank=True)

  # Relational (Profile ID for Current Profile)
  current_profile = models.IntegerField(null=True, blank=True)

  # Appearance in Django System
  def __str__(self):
    return f"{self.email}"