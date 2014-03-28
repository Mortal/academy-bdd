from django.db import models

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
