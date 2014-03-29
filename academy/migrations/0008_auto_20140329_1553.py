# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0007_auto_20140329_1551'),
    ]

    operations = [
        migrations.AlterField(
            model_name='drawncard',
            name='game',
            field=models.ForeignKey(to_field='id', to='academy.Game'),
        ),
    ]
