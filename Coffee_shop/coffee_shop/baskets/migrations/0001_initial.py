# Generated by Django 5.0.6 on 2024-06-24 18:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('goods', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Baskets',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=0, verbose_name='Количество')),
                ('session_key', models.CharField(blank=True, max_length=32, null=True)),
                ('created_timestamp', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('dish', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='goods.dishes', verbose_name='Блюдо')),
            ],
            options={
                'verbose_name': 'Корзина',
                'verbose_name_plural': 'Корзина',
                'db_table': 'basket',
                'ordering': ('id',),
            },
        ),
    ]
