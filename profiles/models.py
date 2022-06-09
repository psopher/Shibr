from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
# blank=False by default -> everything is required
class Profile(models.Model):

  # Profile contents
  bio = models.TextField(max_length=500, default=None, blank=True)
  name = models.CharField(max_length=50, default="No Name Given")
  age = models.PositiveIntegerField(default=None, blank=True)
  school = models.CharField(max_length=50, default=None, blank=True)
  gender = models.CharField(max_length=30, default=None, blank=True)
  images = ArrayField(
      models.TextField(max_length=100, blank=True),
      size=6,
  )

  # Relationship Fields
  owner = models.ForeignKey(
    'jwt_auth.User',
    related_name='profiles',
    on_delete=models.CASCADE,
    null=True,
    blank=True
  )

  # Appearance in Django system
  def __str__(self): 
    return f"{self.name} {self.age} {self.id}"