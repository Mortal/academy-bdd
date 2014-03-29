import logging
import datetime
import json
import random
import django.views.generic as V
from . import models, forms
from django import shortcuts as sc
from django.core.urlresolvers import reverse

class FrontView(V.TemplateView):
    template_name = 'front.html'

class GameCreateView(V.FormView):
    template_name = 'academy/game_create.html'
    form_class = forms.GameCreateForm

    def form_valid(self, form):
        game = models.Game()
        game.save()
        for p in range(4):
            participant = models.Participant(
                    game=game, position=p,
                    player=form.cleaned_data['player%d' % p])
            participant.save()
        return sc.redirect('game_play', pk=game.pk)

class GameListView(V.ListView):
    model = models.Game

class GameSaveView(V.View):
    def post(self, request, pk):
        data = json.loads(request.POST['data'])
        # data = {
        #     'cards': ['H2','C9','DA', ... 52 in total],
        #     'cardtimes': [52 x msepoch],
        #     'chucks': [
        #         {'player': <integer in [0,3]>,
        #          'suit': <integer in [0,3]>,
        #          'start': msepoch,
        #          'stop': msepoch},
        #         3 more...]
        # }

        game = sc.get_object_or_404(models.Game, pk=pk)

        def parse_card(s):
            suits = {suit: idx for idx, suit in enumerate('SHCD')}
            numbers = {n: idx+2 for idx, n in enumerate('23456789TJQKA')}
            return {'suit': suits[s[0]], 'number': numbers[s[1]]}

        def card_to_str(card):
            suits = {idx: suit for idx, suit in enumerate('SHCD')}
            numbers = {idx+2: n for idx, n in enumerate('23456789TJQKA')}
            return suits[card['suit']]+numbers[card['number']]

        participants = list(game.participant_set.all())
        PLAYERS = len(participants)

        cards = [parse_card(s) for s in data['cards']]
        for idx, card in enumerate(cards):
            ts = data['cardtimes'][idx]
            t = datetime.datetime.fromtimestamp(ts // 1000)
            t = t.replace(microseconds=1000*(ts % 1000))
            DrawnCard(
                    participant=participants[idx % PLAYERS],
                    time=t,
                    card=card_to_str(card),
                    position=idx).save()

        game.save()

        for idx, participant in enumerate(participants):
            pcards = cards[idx::4]
            participant.sips = sum(c['number'] for c in pcards)
            participant.average = participant.sips / len(pcards)
            participant.save()

        chucks = models.Chuck.objects.filter(participant__game=game)
        n = chucks.count()
        chucks.delete()
        if n > 0:
            logging.warning("GameSaveView: Deleted %d chucks for game %s" % (n, game))

        for chuckdata in data['chucks']:
            participant = participants[int(chuckdata['participant'])]
            chuck = models.Chuck(participant=participant,
                    time=chuckdata['milliseconds'])
            chuck.save()

        return sc.redirect('game', pk=game.pk)

class GamePlayView(V.DetailView):
    template_name = 'academy/game_play.html'
    model = models.Game

    def get_context_data(self, **kwargs):
        data = super(GamePlayView, self).get_context_data(**kwargs)
        game = data['game']
        for i, p in enumerate(models.Participant.objects.filter(game=game)):
            data['player%d' % (i+1)] = p.player
        return data

class GameView(V.TemplateView):
    template_name = 'academy/game.html'

    def get_game(self):
        return sc.get_object_or_404(models.Game, pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        data = super(GameView, self).get_context_data(**kwargs)
        game = self.get_game()
        participants = game.participant_set.all()
        standings = participants.order_by('-sips')
        players = [p.player for p in participants]
        chucks = list(models.Chuck.objects.filter(participant__game=game))
        for chuck in chucks:
            chuck.seconds = chuck.time / 1000
        cards = game.cards.split(',')
        data['game'] = game
        data['cards'] = game.cards.split(',')
        data['cardrounds'] = [cards[i:i+len(players)]
                for i in range(0, len(cards), len(players))]
        data['standings'] = standings
        data['players'] = players
        data['playercount'] = len(players)
        data['chucks'] = chucks

        return data

class GameSimulateView(V.View):
    def post(self, players=4):
        game = Game()
        game.save()

        all_players = list(models.Player.objects.all())
        random.shuffle(all_players)

        participants = [Participant(game=game, player=p, position=i)
                for i, p in enumerate(all_players[0:players])]

        for p in participants:
            p.save()

        def next_event_time():
            return 60 + 30*(random.random()-.5)

        cards = models.Card.deck(suits=players)
        random.shuffle(cards)
        time = datetime.datetime.now()
        for i, card in enumerate(cards):
            p = participants[i % len(participants)]
            drawncard = DrawnCard(
                    participant=p,
                    time=time,
                    card=card,
                    position=i)
            drawncard.save()
            time += datetime.timedelta(seconds=next_event_time())
            if card.number == 14:
                chuck_time = int(5000 + random.random()*10000)
                chuck = Chuck(participant=p,
                        start_time=time,
                        end_time=time + datetime.timedelta(seconds=chuck_time/1000),
                        time=chuck_time,
                        card=card)
                chuck.save()
                time += datetime.timedelta(seconds=next_event_time())

        return sc.redirect('game', pk=game.pk)


class PlayerCreateView(V.View):
    def post(self, request):
        nick = request.POST['nick']
        player = models.Player(nick=nick)
        player.save()
        return sc.redirect('player_list')

class PlayerListView(V.ListView):
    model = models.Player

class PlayerView(V.TemplateView):
    pass
