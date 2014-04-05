from django import forms
import logging

from . import models

class GameCreateForm(forms.Form):
    suits = forms.CharField(max_length=40)

    def clean_suits(self

    def __init__(self, data=None, *args, **kwargs):
        super(GameCreateForm, self).__init__(data, *args, **kwargs)

        player_fields = 4
        if data:
            while ('player_%d' % player_fields) in data:
                player_fields += 1

        for i in range(player_fields):
            self.fields['player_%d_pk' % i] = forms.IntegerField(required=False, widget=forms.HiddenInput())
            self.fields['player_%d_nick' % i] = forms.CharField(required=False)

    @staticmethod
    def _iter_keys_like(data, pattern):
        i = 0
        while True:
            try:
                d = data[pattern % i]
            except KeyError:
                return
            yield i, d
            i += 1

    def players(self):
        for i, pk in self._iter_keys_like(self.cleaned_data, 'player_%d_pk'):
            if pk == None:
                continue
            nick = self.cleaned_data['player_%d_nick' % i]
            if pk == -1:
                try:
                    p = models.Player.objects.get(nick=nick)
                    logging.warning("User input pk=-1 "
                        "but chose a nick that already exists: %r" % nick)
                except models.Player.DoesNotExist:
                    p = models.Player(nick=nick)
                    p.save()
            else:
                p = models.Player.objects.get(pk=pk)
            yield p

    def player_hidden_fields(self):
        for i, p in self._iter_keys_like(self, 'player_%d_pk'):
            yield p

    def player_nick_fields(self):
        for i, p in self._iter_keys_like(self, 'player_%d_nick'):
            yield p
