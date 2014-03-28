from django.db import models

SUITS = [dict(zip(('letter', 'name', 'color'), values)) for values in (
    # Classic four suits
    # Black/red primary
    ['S', 'spades', 'black'],
    ['H', 'hearts', 'red'],
    # Black/red secondary
    ['C', 'clubs', 'black'],
    ['D', 'diamonds', 'red'],
    # Suits as suggested by R. Wayne Schmittberger, see enwiki:Suit [cards]
    ['B', 'beasts', 'red'], # spades with horns and tail (devil)
    ['V', 'valentines', 'red'], # hearts with an arrow through
    ['L', 'leaves', 'green'], # clubs with a rounded bottom (lucky cloverleaf)
    ['K', 'kites', 'green'] # diamonds with a cross through
)]

class Game(models.Model):
    def __str__(self):
        participants = list(self.participant_set.all())
        if participants:
            return "Game between %s" % ', '.join(str(p.player)
                    for p in participants)
        else:
            return "New game %d" % self.pk

class Player(models.Model):
    nick = models.CharField(max_length=40)

    def __str__(self):
        return self.nick

class Participant(models.Model):
    player = models.ForeignKey(Player)
    game = models.ForeignKey(Game)
    position = models.IntegerField()

    sips = models.IntegerField(blank=True, null=True)
    average = models.FloatField(blank=True, null=True)

    class Meta:
        ordering = ('game', 'position')
        unique_together = (('game', 'position'),)

class DrawnCard(models.Model):
    participant = models.ForeignKey(Participant)
    time = models.DateTimeField()
    card = models.CharField(max_length=2)
    position = models.IntegerField()

    class Meta:
        ordering = ('participant__game', 'position')

class Chuck(models.Model):
    participant = models.ForeignKey(Participant)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    time = models.IntegerField(help_text='Chuck time in milliseconds')
    card = models.CharField(max_length=2)
