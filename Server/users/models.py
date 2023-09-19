from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    caffeine_today = models.PositiveSmallIntegerField
    
