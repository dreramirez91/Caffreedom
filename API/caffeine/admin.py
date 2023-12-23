from django.contrib import admin
from .models import CaffeineIntake


class CaffeineIntakeAdmin(admin.ModelAdmin):
    readonly_fields = ("id",)


admin.site.register(CaffeineIntake, CaffeineIntakeAdmin)
