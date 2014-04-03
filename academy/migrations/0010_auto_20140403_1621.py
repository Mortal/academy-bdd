# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0009_chuck_game'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chuck',
            name='game',
            field=models.ForeignKey(to_field='id', to='academy.Game'),
        ),
    ]
