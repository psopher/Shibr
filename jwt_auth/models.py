from django.db import models
from django.contrib.auth.models import AbstractUser 

# Create your models here.
class User(AbstractUser):
  email = models.CharField(max_length=50, unique=True)
  profile_image = models.CharField(max_length=300, default="https://res.cloudinary.com/drgegagha/image/upload/v1654545117/shibr/image-b-large_in19xb.png")

  def __str__(self): #How it will display in the User list in the database
    return f"{self.email}"