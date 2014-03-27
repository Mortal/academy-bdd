# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nick', models.CharField(max_length=40)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_time', models.DateTimeField(null=True, blank=True)),
                ('end_time', models.DateTimeField(null=True, blank=True)),
                ('cards', models.CharField(max_length=155)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('player', models.ForeignKey(to_field='id', to='academy.Player')),
                ('game', models.ForeignKey(to_field='id', to='academy.Game')),
                ('position', models.IntegerField()),
                ('sips', models.IntegerField(null=True, blank=True)),
                ('average', models.FloatField(null=True, blank=True)),
            ],
            options={
                'ordering': ('game', 'position'),
                'unique_together': set([('game', 'position')]),
            },
            bases=(models.Model,),
        ),
    ]
