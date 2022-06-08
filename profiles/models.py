from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
# blank=False by default -> everything is required
class Profile(models.Model):
  bio = models.CharField(max_length=500, default=None)
  name = models.CharField(max_length=50, default=None)
  age = models.PositiveIntegerField(default=None)
  school = models.CharField(max_length=50, default=None)
  gender = models.CharField(max_length=30, default=None)
  images = ArrayField(
      models.CharField(max_length=100, blank=True),
      size=6,
  )

  def __str__(self): #How it will display in the Profile list in the database
    return f"{self.name} {self.age} {self.id}"