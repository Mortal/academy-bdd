# encoding: utf8
from django.db import models, migrations

def set_card_games(apps, schema_editor):
    DrawnCard = apps.get_model('academy', 'DrawnCard')
    Game = apps.get_model('academy', 'Game')
    Participant = apps.get_model('academy', 'Participant')
    for dc in DrawnCard.objects.all():
        dc.game = Game.objects.get(pk=dc.participant.game.pk)
        dc.save()

class Migration(migrations.Migration):

    dependencies = [
        ('academy', '0006_auto_20140329_1551'),
    ]

    operations = [
            migrations.RunPython(set_card_games),
    ]
