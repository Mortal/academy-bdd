# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chuck',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('participant', models.ForeignKey(to_field='id', to='academy.Participant')),
                ('time', models.IntegerField(help_text='Chuck time in milliseconds')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
