from django.db import models
from django.contrib.auth.models import User
from datetime import date


class CaffeineIntake(models.Model):
    caffeine = models.PositiveSmallIntegerField(default=0)
    amount = models.DecimalField(default=0, max_digits=7, decimal_places=2)
    type = models.CharField(max_length=100)
    notes = models.TextField(null=True, blank=True)
    measurement = models.CharField(max_length=100)
    date = models.DateField(default=date.today)
    user = models.ForeignKey(
        User, related_name="caffeine_intakes", on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.type)
