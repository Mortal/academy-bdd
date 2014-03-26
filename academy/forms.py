from django import forms

from . import models

class GameSettingsForm(forms.Form):
    player1 = forms.ModelChoiceField(queryset=models.Player.objects.all())
    player2 = forms.ModelChoiceField(queryset=models.Player.objects.all())
    player3 = forms.ModelChoiceField(queryset=models.Player.objects.all())
    player4 = forms.ModelChoiceField(queryset=models.Player.objects.all())
