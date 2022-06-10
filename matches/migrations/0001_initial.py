# Generated by Django 4.0.5 on 2022-06-10 20:05

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exchange_social_media', models.BooleanField(default=False)),
                ('matched_users', models.ManyToManyField(blank=True, related_name='matches', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
