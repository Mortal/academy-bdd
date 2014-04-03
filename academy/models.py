from django.core import exceptions
from django.db import models
from django.contrib import auth
from django.utils.six import with_metaclass

SUITS = [dict(zip(('letter', 'name', 'color', 'symbol'), values)) for values in (
    # Classic four suits
    # Black/red primary
    ['S', 'spades', 'black', '♠'],
    ['H', 'hearts', 'red', '♥'],
    # Black/red secondary
    ['C', 'clubs', 'black', '♣'],
    ['D', 'diamonds', 'red', '♦'],

    # Ideas for additional suits:
    # Bullets, Suns, Houses, Blocks, Triangles, Arrows
    # Shields, Moons ☾, Suns ☀, Stars ★

    # Suits as suggested by R. Wayne Schmittberger, see enwiki:Suit [cards]
    #['B', 'beasts', 'red'], # spades with horns and tail (devil)
    #['V', 'valentines', 'red'], # hearts with an arrow through
    #['L', 'leaves', 'green'], # clubs with a rounded bottom (lucky cloverleaf)
    #['K', 'kites', 'green'] # diamonds with a cross through

    ['K', 'kites', 'blue', '⚵'],
    ['F', 'flowers', 'green', '⚘'],
    ['A', 'arrows', 'blue', '↑'],
    ['T', 'stars', 'green', '★'],
)]

class Card(object):
    def __init__(self, suit, number):
        self.suit = suit
        self.number = number

    def __str__(self):
        numbers = '23456789TJQKA'
        if 2 <= self.number <= 14:
            return '%s%s' % (self.suit, numbers[self.number-2])
        return '??'

    @classmethod
    def deck(cls, suits):
        if not (1 <= suits <= len(SUITS)):
            raise ValueError("Suits should be in [1, %d], not %r"
                    % (len(SUITS), suits))
        return [cls(suit=suit['letter'], number=number)
                for suit in SUITS[:suits] for number in range(2, 15)]

class CardField(with_metaclass(models.SubfieldBase, models.Field)):
    description = "A single card (suit + number)"

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 2
        super(CardField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        if value is None:
            return None
        if isinstance(value, Card):
            return value
        numbers = dict(zip('23456789TJQKA', range(2,15)))
        suits = {suit['letter']: suit['letter'] for suit in SUITS}
        try:
            suit_string, number_string = value
            return Card(suit=suits[suit_string],
                    number=numbers[number_string])
        except (KeyError, ValueError):
            raise exceptions.ValidationError('Invalid input for a Card instance')

    def get_prep_value(self, value):
        if value is None:
            return None
        elif isinstance(value, Card):
            return str(value)
        else:
            raise exceptions.ValidationError('Invalid Card value %r of type %s'
                    % (value, type(value)))

    def get_internal_type(self):
        return 'CharField'

class Game(models.Model):
    @property
    def sips(self):
        return 14

    def __str__(self):
        participants = list(self.participant_set.all())
        if participants:
            return "Game between %s" % ', '.join(str(p.player)
                    for p in participants)
        else:
            return "New game %d" % self.pk

class Player(models.Model):
    user = models.ForeignKey(auth.models.User, blank=True, null=True)
    nick = models.CharField(max_length=40)

    def __str__(self):
        return self.nick

class Participant(models.Model):
    player = models.ForeignKey(Player)
    game = models.ForeignKey(Game)
    position = models.IntegerField()

    class Meta:
        ordering = ('game', 'position')
        unique_together = (('game', 'position'),)

class DrawnCard(models.Model):
    game = models.ForeignKey(Game)
    participant = models.ForeignKey(Participant)
    time = models.DateTimeField()
    card = CardField()
    position = models.IntegerField()

    class Meta:
        ordering = ('participant__game', 'position')
        unique_together = (('game', 'position'),)

    def save(self, *args, **kwargs):
        self.game = self.participant.game
        super(DrawnCard, self).save(*args, **kwargs)

class Chuck(models.Model):
    game = models.ForeignKey(Game)
    participant = models.ForeignKey(Participant)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    time = models.IntegerField(help_text='Chuck time in milliseconds')
    card = CardField()

    def save(self, *args, **kwargs):
        self.game = self.participant.game
        super(Chuck, self).save(*args, **kwargs)
