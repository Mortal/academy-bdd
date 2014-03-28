from django.db import models

class Game(models.Model):
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    cards = models.CharField(max_length=52*3-1)

    def is_started(self):
        return bool(self.start_time)

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
        ordering = ('game', 'position')

class Chuck(models.Model):
    participant = models.ForeignKey(Participant)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    time = models.IntegerField(help_text='Chuck time in milliseconds')
    card = models.CharField(max_length=2)
