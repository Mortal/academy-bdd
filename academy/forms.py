from django import forms
import logging

from . import models

class GameCreateForm(forms.Form):
    player0 = forms.ModelChoiceField(required=True,  queryset=models.Player.objects.all())
    player1 = forms.ModelChoiceField(required=False, queryset=models.Player.objects.all())
    player2 = forms.ModelChoiceField(required=False, queryset=models.Player.objects.all())
    player3 = forms.ModelChoiceField(required=False, queryset=models.Player.objects.all())
    player4 = forms.ModelChoiceField(required=False, queryset=models.Player.objects.all())
    player5 = forms.ModelChoiceField(required=False, queryset=models.Player.objects.all())
    player6 = forms.ModelChoiceField(required=False, queryset=models.Player.objects.all())
    player7 = forms.ModelChoiceField(required=False, queryset=models.Player.objects.all())

    def player_fields(self):
        return [self['player%d' % n] for n in range(8)]

    def clean(self):
        super(GameCreateForm, self).clean()
        if self.errors:
            return
        cleaned_data = self.cleaned_data
        maxplayer = max(d for d in range(8) if cleaned_data['player%d' % d])
        for p in range(maxplayer+1):
            if not cleaned_data['player%d' % p]:
                self.add_error('player%d' % p, forms.ValidationError('This field is required'))
        for p in range(maxplayer+1, 8):
            del cleaned_data['player%d' % p]
