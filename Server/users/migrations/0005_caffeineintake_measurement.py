# Generated by Django 4.2 on 2023-09-27 15:11

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0004_caffeineintake_caffeine"),
    ]

    operations = [
        migrations.AddField(
            model_name="caffeineintake",
            name="measurement",
            field=models.CharField(default="Cups", max_length=100),
            preserve_default=False,
        ),
    ]