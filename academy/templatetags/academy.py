from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def card_html(value):
    suits = dict(zip('SHCD', 'spades hearts clubs diams'.split()))
    numbers = dict(zip('23456789JQKA', '23456789JQKA'))
    numbers['T'] = '10'

    try:
        suit, number, time = value.card.suit, value.card.number, value.time
    except AttributeError:
        suit, number = str(value)
        number = numbers.get(number)
        time = None
    try:
        html = ('<span class="suit suit_{suit}">&{suit};</span>'
                '<span class="number number_{number}">{number}</span>'
                .format(suit=suits[suit], number=number))
    except (KeyError, IndexError):
        html = '??'
        raise
    if time is not None:
        html = '<span title="%s">%s</span>' % (time, html)
    return mark_safe(html)
