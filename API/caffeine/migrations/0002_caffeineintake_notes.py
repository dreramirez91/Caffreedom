# Generated by Django 5.0 on 2024-01-10 20:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("caffeine", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="caffeineintake",
            name="notes",
            field=models.TextField(blank=True, null=True),
        ),
    ]
