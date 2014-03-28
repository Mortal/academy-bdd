# encoding: utf8
from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0003_chuck_card'),
    ]

    operations = [
        migrations.CreateModel(
            name='DrawnCard',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('participant', models.ForeignKey(to_field='id', to='academy.Participant')),
                ('time', models.DateTimeField()),
                ('card', models.CharField(max_length=2)),
                ('position', models.IntegerField()),
            ],
            options={
                'ordering': ('participant__game', 'position'),
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='chuck',
            name='end_time',
            field=models.DateTimeField(default=datetime.date(2014, 3, 28)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='chuck',
            name='start_time',
            field=models.DateTimeField(default=datetime.date(2014, 3, 28)),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='game',
            name='cards',
        ),
        migrations.RemoveField(
            model_name='game',
            name='start_time',
        ),
        migrations.RemoveField(
            model_name='game',
            name='end_time',
        ),
    ]
