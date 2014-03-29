# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0005_auto_20140329_1126'),
    ]

    operations = [
        migrations.AddField(
            model_name='drawncard',
            name='game',
            field=models.ForeignKey(null=True, to='academy.Game', blank=True, to_field='id'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='drawncard',
            unique_together=set([('game', 'position')]),
        ),
    ]
