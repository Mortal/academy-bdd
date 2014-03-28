from django import forms

from . import models

class GameCreateForm(forms.Form):
    player0 = forms.ModelChoiceField(queryset=models.Player.objects.all())
    player1 = forms.ModelChoiceField(queryset=models.Player.objects.all())
    player2 = forms.ModelChoiceField(queryset=models.Player.objects.all())
    player3 = forms.ModelChoiceField(queryset=models.Player.objects.all())

    def player_fields(self):
        return [self['player%d' % n] for n in range(4)]
