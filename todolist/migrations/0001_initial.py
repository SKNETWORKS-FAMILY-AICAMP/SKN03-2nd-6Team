# Generated by Django 5.1 on 2024-08-17 13:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TtareungiLocation',
            fields=[
                ('rental_lo_id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('addr1', models.CharField(max_length=100)),
                ('addr2', models.CharField(max_length=255)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
            ],
            options={
                'db_table': 'ttaerungi_location',
            },
        ),
    ]
