# Generated by Django 4.0.5 on 2022-06-24 12:19

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True, default=None, max_length=500)),
                ('name', models.CharField(default='Anonymous', max_length=50)),
                ('age', models.PositiveIntegerField(blank=True, default=None)),
                ('school', models.CharField(blank=True, default=None, max_length=50)),
                ('gender', models.CharField(blank=True, default=None, max_length=30)),
                ('images', django.contrib.postgres.fields.ArrayField(base_field=models.TextField(blank=True, max_length=200), size=6)),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='profiles', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
