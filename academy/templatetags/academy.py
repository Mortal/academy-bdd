from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
@stringfilter
def card_html(value):
    suits = dict(zip('SHCD', 'spades hearts clubs diams'.split()))
    numbers = dict(zip('23456789JQKA', '23456789JQKA'))
    numbers['T'] = '10'
    try:
        html = ('<span class="suit suit_{suit}">&{suit};</span>'
                '<span class="number number_{number}">{number}</span>'
                .format(suit=suits[value[0]], number=numbers[value[1]]))
    except (KeyError, IndexError):
        html = '??'
    return mark_safe(html)
