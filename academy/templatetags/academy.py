from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe
from .. import models

register = template.Library()

@register.filter
def card_html(value):
    suits = {suit['letter']: suit['symbol'] for suit in models.SUITS}
    numbers = dict(zip('23456789JQKA', '23456789JQKA'))
    numbers['T'] = '10'

    try:
        suit, number, time = value.card.suit, value.card.number, value.time
        number = numbers['23456789TJQKA'[number-2]]
    except AttributeError:
        suit, number = str(value)
        number = numbers.get(number)
        time = None
    try:
        html = ('<span class="suit suit_{suit}">{symbol}</span>'
                '<span class="number number_{number}">{number}</span>'
                .format(suit=suit, symbol=suits[suit], number=number))
    except (KeyError, IndexError):
        html = '??'
        raise
    if time is not None:
        html = '<span title="%s">%s</span>' % (time, html)
    return mark_safe(html)
