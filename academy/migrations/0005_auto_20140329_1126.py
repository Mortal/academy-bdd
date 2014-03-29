# encoding: utf8
from django.db import models, migrations
import academy.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('academy', '0004_auto_20140328_1528'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='user',
            field=models.ForeignKey(to_field='id', null=True, blank=True, to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.RemoveField(
            model_name='participant',
            name='average',
        ),
        migrations.RemoveField(
            model_name='participant',
            name='sips',
        ),
        migrations.AlterField(
            model_name='chuck',
            name='card',
            field=academy.models.CardField(max_length=2),
        ),
        migrations.AlterField(
            model_name='drawncard',
            name='card',
            field=academy.models.CardField(max_length=2),
        ),
    ]
