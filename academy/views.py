import logging
import datetime
import json
import django.views.generic as V
from . import models, forms
from django import shortcuts as sc
from django.core.urlresolvers import reverse

class FrontView(V.TemplateView):
    template_name = 'front.html'

class GameCreateView(V.View):
    def post(self, request):
        game = models.Game()
        game.save()

        return sc.redirect('game_settings', pk=game.pk)

class GameListView(V.ListView):
    model = models.Game

class GameSaveView(V.View):
    def post(self, request, pk):
        data = json.loads(request.POST['data'])
        # data = {
        #     'cards': ['H2','C9','DA', ... 52 in total],
        #     'chucks': [
        #         {'player': <integer in [0,3]>,
        #          'suit': <integer in [0,3]>,
        #          'milliseconds': <integer>},
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

        cards = [parse_card(s) for s in data['cards']]

        game.cards = ','.join(card_to_str(card) for card in cards)
        game.end_time = datetime.datetime.now()
        game.save()

        participants = list(game.participant_set.all())

        for idx, participant in enumerate(participants):
            pcards = cards[idx::4]
            participant.sips = sum(c['number'] for c in pcards)
            participant.average = participant.sips / len(pcards)
            participant.save()

        chucks = models.Chuck.objects.filter(participant__game=game)
        n = chucks.count()
        chucks.delete()
        if n > 0:
            logging.warning("GameSettingsView: Deleted %d chucks for game %s" % (n, game))

        for chuckdata in data['chucks']:
            participant = participants[int(chuckdata['participant'])]
            chuck = models.Chuck(participant=participant,
                    time=chuckdata['milliseconds'])
            chuck.save()

        return sc.redirect('game', pk=game.pk)

class GameSettingsView(V.FormView):
    form_class = forms.GameSettingsForm
    template_name = 'academy/game_settings.html'

    def get_context_data(self, **kwargs):
        data = super(GameSettingsView, self).get_context_data(**kwargs)
        data['game'] = self.get_game()
        return data

    def get_game(self):
        return sc.get_object_or_404(models.Game, pk=self.kwargs['pk'])

    def form_valid(self, form):
        game = self.get_game()
        participants = models.Participant.objects.filter(game=game)
        n = participants.count()
        participants.delete()
        if n > 0:
            logging.warning("GameSettingsView: Deleted %d participants for game %s" % (n, game))
        n = 4
        for i in range(n):
            player = form.cleaned_data['player%d' % (i+1)]
            part = models.Participant(game=game, player=player, position=i)
            part.save()

        game.start_time = datetime.datetime.now()
        game.save()

        return sc.redirect('game_play', pk=game.pk)

class GamePlayView(V.TemplateView):
    template_name = 'academy/game_play.html'

    def get_game(self):
        return sc.get_object_or_404(models.Game, pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        data = super(GamePlayView, self).get_context_data(**kwargs)
        game = self.get_game()
        data['game'] = game
        return data

class GameView(V.TemplateView):
    template_name = 'academy/game.html'

    def get_game(self):
        return sc.get_object_or_404(models.Game, pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        data = super(GameView, self).get_context_data(**kwargs)
        game = self.get_game()
        participants = list(game.participant_set.all())
        players = [p.player for p in participants]
        chucks = list(models.Chuck.objects.filter(participant__game=game))
        data['game'] = game
        data['cards'] = game.cards.split(',')
        data['participants'] = participants
        data['players'] = players
        data['chucks'] = chucks

        return data

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
