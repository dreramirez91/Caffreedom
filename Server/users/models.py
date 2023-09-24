from django.db import models
from django.contrib.auth.models import User
from datetime import date

class CaffeineIntake(models.Model):
    amount = models.PositiveSmallIntegerField(default=0)
    date = models.DateField(default=date.today)
    user = models.ForeignKey(
        User,
        related_name="caffeine_intakes",
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return str(self.amount)
