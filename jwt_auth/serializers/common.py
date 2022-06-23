from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError #this error will be thrown if our password doesn't match password_confirmation

# User model
User = get_user_model()

# inherit model serializer
# This if for registration of new users
class UserSerializer(serializers.ModelSerializer):
  # we're gonna define password and password_confirmation fields as write_only
  password = serializers.CharField(write_only=True) # ensures these are never returned when converting to JSON
  password_confirmation = serializers.CharField(write_only=True)

  def validate(self, data):
    # check our passwords match
    # hash our password
    # readd to the hashed password to the data to be added to the db

    # remove password and password_confirmation from the data dict
    # we'll use pop methed to save these to variables
    password = data.pop('password')
    password_confirmation = data.pop('password_confirmation')

    # check if password matches password_confirmation
    if password != password_confirmation:
      raise ValidationError({
        'password_confirmation': 'Does not match password'
      })

    # This part is optional: can be left off if we don't want secure passwords
    # Validate password by default conditions
    # try:
    #   password_validation.validate_password(password)
    # except ValidationError as e:
    #   print(e)
    #   raise ValidationError({
    #     'password': e.messages
    #   })

    # If we get to this point, validation passed
    # Now we need to hash the password
    data['password'] = make_password(password)

    return data

  class Meta:
    model = User
    # fields = '__all__'
    fields = (
      'id',  
      'email', 
      'username', 
      'password',
      'password_confirmation',
      'profile_image', 
      'karma', 
      'interested_in', 
      'min_age', 
      'max_age', 
      'show_me', 
      'give_social', 
      'ig', 
      'sc', 
      'tw', 
      'current_profile'
    )


# this is used for updating user settings without having to input your password every time
class UserSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
          'id',  
          'email', 
          'username', 
          'profile_image', 
          'karma', 
          'interested_in', 
          'min_age', 
          'max_age', 
          'show_me', 
          'give_social', 
          'ig', 
          'sc', 
          'tw', 
          'current_profile'
        )