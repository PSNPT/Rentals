# Generated by Django 4.1.7 on 2023-04-06 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='avatar',
            field=models.ImageField(default='avatars/default.png', upload_to='avatars/', verbose_name='avatar'),
        ),
    ]