# Generated by Django 4.1.7 on 2023-04-10 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0008_alter_property_accessibility'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='accessibility',
            field=models.ManyToManyField(blank=True, to='property.accessibility'),
        ),
        migrations.AlterField(
            model_name='property',
            name='amenities',
            field=models.ManyToManyField(blank=True, to='property.amenity'),
        ),
    ]
