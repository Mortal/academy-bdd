# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0008_auto_20140329_1553'),
    ]

    operations = [
        migrations.AddField(
            model_name='chuck',
            name='game',
            field=models.ForeignKey(to_field='id', null=True, to='academy.Game', blank=True),
            preserve_default=True,
        ),
    ]
