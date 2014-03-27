# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0002_chuck'),
    ]

    operations = [
        migrations.AddField(
            model_name='chuck',
            name='card',
            field=models.CharField(default='HA', max_length=2),
            preserve_default=False,
        ),
    ]
