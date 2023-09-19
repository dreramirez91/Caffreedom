from django.db import models
from django.contrib.auth.models import User
from datetime import date


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.first_name


class CaffeineIntake(models.Model):
    amount = models.PositiveSmallIntegerField(default=0)
    date = models.DateField(default=date.today)
    profile = models.ForeignKey(
        Profile,
        related_name="caffeine_intakes",
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return str(self.amount)
