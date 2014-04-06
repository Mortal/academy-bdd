/** @jsx React.DOM */
///////////////////////////////////////////////////////////////////////////////
// Configuration provided by server side
///////////////////////////////////////////////////////////////////////////////

var config = config;
SUITS = config['suits'].map(function (a) { return {letter: a[0], name: a[1], color: a[2], symbol: a[3]}; });

ACE = 14;
SIPS = 14;

///////////////////////////////////////////////////////////////////////////////
// Templates in the HTML layout
///////////////////////////////////////////////////////////////////////////////

// Used by make_template for DOM text nodes
function make_text_template(s) {
    return function (dest, dict) {
        dest.appendChild(document.createTextNode(s));
    };
}

// Used by make_template for DOM elements
function make_el_template(children, tagName, className) {
    return function (dest, dict) {
        var el = document.createElement(tagName);
        for (var i = 0, l = children.length; i < l; ++i) {
            children[i](el, dict);
        }
        if (className) {
            el.className = className;
            dict[className] = el;
        }
        dest.appendChild(el);
    };
}

// Given an element, return a function (dest, dict) that makes a deep copy of
// the element into the given dest, storing references to elements by their
// className in the given dict.
function make_template(e) {
    if (e.nodeType == 3) { // Text
        return make_text_template(e.nodeValue);
    } else if (e.nodeType == 1) { // Element
        var children = [].slice.call(e.childNodes);
        children = children.map(make_template);
        var className = e.className;
        return make_el_template(children, e.tagName.toLowerCase(), className);
    }
}

// Given an element, replace it by l copies using make_template
// and return a list of dictionaries as returned by make_template()(dest, dict).
function unfold_template(e, l) {
    var instances = [];
    var tpl = make_template(e.firstElementChild);
    var container = e.parentNode;
    container.removeChild(e);
    for (var p = 0; p < l; ++p) {
        var dict = {};
        tpl(container, dict);
        instances.push(dict);
    }
    return instances;
}

///////////////////////////////////////////////////////////////////////////////
// Game runtime state.
///////////////////////////////////////////////////////////////////////////////

function Game(elem_by_id, config) {
    // elem_by_id(x) is document.getElementById(x).
    // config
    this.el_deck = elem_by_id('deck');
    this.el_history = elem_by_id('history');
    this.el_chuck = elem_by_id('chuck');
    this.el_chuck_history = elem_by_id('chuck_history');
    this.el_upload_button = elem_by_id('upload_button');
    this.players = config['players'];
    this.suits = this.players.length;
    this.deck = make_shuffled_deck(this.suits);
    this.chucks = [];
    this.history = [];
    this.times = [];
    this.chuck_history = [];

    this.el_state = unfold_template(elem_by_id('playerstatetemplate'),
                                    this.players.length);

    this.render();

    this.is_chucking = false;
}

// Button handler: Draw card
Game.prototype.ui_draw = function Game_ui_draw() {
    if (this.is_chucking) return;
    if (this.deck.length == 0) return;
    var card = this.deck.pop();
    this.history.push(card);
    this.times.push(new Date().getTime());
    this.render();
    if (card_to_number(card) == ACE) {
        this.is_chucking = true;
        this.el_chuck.textContent = 'Start the time!';
    }
};

// Button handler: Start/stop chuck timer
Game.prototype.ui_chuck = function Game_ui_chuck() {
    if (!this.is_chucking) return;
    if (!this.chuck_start) {
        this.chuck_start = new Date().getTime();
        this.start_chuck_timer();
    } else {
        var chuck_stop = new Date().getTime();
        this.stop_chuck_timer();
        var milliseconds = chuck_stop - this.chuck_start;
        this.set_chuck(milliseconds);

        var PLAYERS = this.players.length;
        this.chuck_history.push({
            player: (this.history.length - 1) % PLAYERS,
            card: this.history[this.history.length-1],
            start: this.chuck_start,
            stop: chuck_stop,
            milliseconds: milliseconds
        });

        this.is_chucking = false;
        this.chuck_start = null;

        this.render();
    }
};

// Button handler: Upload game
Game.prototype.ui_save = function Game_ui_save(form) {
    var data = {'cards': this.history, 'cardtimes': this.times, 'chucks': []};
    for (var i = 0; i < this.chuck_history.length; ++i) {
        var c = this.chuck_history[i];
        data['chucks'].push({
            'participant': c.player,
            'card': c.card,
            'start': c.start,
            'stop': c.stop
        });
    }
    form.data.value = JSON.stringify(data);
};

// Button handler: Shuffle
Game.prototype.ui_shuffle = function Game_ui_shuffle() {
    console.log("Shuffling deck...");
    for (var i = 0; i < 52; ++i) {
	return this.cards[i];
    }
};

Game.prototype.start_chuck_timer = function Game_start_chuck_timer() {
    var self = this;
    this.chuck_interval = setInterval(function () {
        var milliseconds = new Date().getTime() - self.chuck_start;
        self.set_chuck(milliseconds);
    }, 10);
};

Game.prototype.stop_chuck_timer = function Game_stop_chuck_timer() {
    clearInterval(this.chuck_interval);
};

function milliseconds_to_string(milliseconds) {
    var minutes = (seconds / 60000) | 0;
    var seconds = (milliseconds / 1000 - minutes * 60) | 0;
    milliseconds = milliseconds % 1000;
    function z(n, l) {
        var s = ''+n;
        while (s.length < l) s = '0' + s;
        return s;
    }
    return z(minutes, 2)+':'+z(seconds, 2)+'.'+z(milliseconds, 3);
}

Game.prototype.set_chuck = function (milliseconds) {
    this.el_chuck.textContent = milliseconds_to_string(milliseconds);
};

var Deck = React.createClass({
    render: function () {
        return (
            <div className="deck">
            Hello world!
            </div>
        );
    }
});

Game.prototype.render = function Game_render() {
    this.render_deck();
    this.render_state();
    this.render_history();
    this.render_chuck_history();
    this.el_upload_button.style.display = (
        (this.deck.length == 0) ? '' : 'none');
};

function render_rows(e, rows, celltype) {
    e.innerHTML = '';
    for (var i = 0; i < rows.length; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < rows[i].length; ++j) {
            var cell = document.createElement(celltype);
            cell.innerHTML = rows[i][j];
            row.appendChild(cell);
        }
        e.appendChild(row);
    }
}

Game.prototype.render_deck = function Game_render_deck() {
    var rows = [];
    var s = [];
    for (var suit = 0; suit < this.suits; ++suit) {
        var row = [];
        for (var n = 2; n <= ACE; ++n) {
            var c = make_card(suit, n);
            if (this.deck.indexOf(c) == -1) row.push('&mdash;');
            else row.push(card_symbol(c));
        }
        rows.push(row);
    }
    render_rows(this.el_deck, rows, 'td');
};

function round_100(n) {
    var s = n+'';
    return s.replace(/([.,]..).*/, '$1');
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.substring(1, s.length);
}

function card_desc(card) {
    var suit = SUITS[card_to_suit(card)];
    var suit_name = capitalize(suit.name);
    var suit_color = suit.color;
    var numbers = 'Two Three Four Five Six Seven Eight Nine Ten Jack Queen King Ace'.split(' ');
    var number = card_to_number(card);
    number_name = numbers[number - 2];
    return ('<span class="number_'+number+'">'+number_name+'</span> of <span style="color: '+suit_color+'">'+suit_name+'</span>');
}

function card_symbol(card) {
    var suit = SUITS[card_to_suit(card)];
    var n = card_to_number(card);
    if (n > 10) n = 'JQKA'.charAt(n-11);
    return ('<b style="color: '+suit.color+'">'
            +suit.symbol+'</b><b class="number_'+n+'">'+n+'</b>');
}

Game.prototype.render_state = function Game_render_state() {
    var PLAYERS = this.players.length;
    var sips = [];
    var n = [];
    for (var i = 0; i < PLAYERS; ++i) {
        sips.push(0);
        n.push(0);
        for (var j = i; j < this.history.length; j += PLAYERS) {
            sips[i] += card_to_number(this.history[j]);
            ++n[i];
        }
    }
    var positions = new Array(PLAYERS);
    var standings = sips.slice().map(function (s, i) { return [s, i]; });
    standings.sort(function (a, b) { return b[0] - a[0]; });
    for (var i = 0; i < PLAYERS; ++i) {
        if (i > 0 && standings[i][0] == standings[i-1][0]) {
            positions[standings[i][1]] = positions[standings[i-1][1]];
        } else {
            positions[standings[i][1]] = i+1;
        }
    }
    for (var i = 0; i < PLAYERS; ++i) {
        var card = (this.history.length <= i) ? '' : (
            this.history[PLAYERS * (((this.history.length - i - 1) / PLAYERS) | 0) + i]);

        var beers = (sips[i] / SIPS) | 0;

        var remaining_sips = (1 + beers) * SIPS - sips[i];

        var st = this.el_state[i];
        st['card'].innerHTML = (card == '') ? '' : card_desc(card);
        st['name'].textContent = positions[i]+'. '+this.players[i];
        st['remaining'].textContent = remaining_sips;
        st['sips'].textContent = sips[i];
        st['beers'].textContent = beers;
        st['average'].textContent = (n[i] ? round_100(sips[i] / n[i]) : '0');
        st['playerstate'].className = 'playerstate position'+positions[i];
    }
};

Game.prototype.render_history = function Game_render_history() {
    var e = this.el_history;
    if (!e.tHead) {
        var thead = document.createElement('thead');
        render_rows(thead, [this.players], 'th');
        e.appendChild(thead);
    }
    if (e.tBodies.length == 0) e.appendChild(document.createElement('tbody'));
    var tb = e.tBodies[0];
    tb.innerHTML = '';
    var rows = [];
    var PLAYERS = this.players.length;
    for (var i = 0; i < this.history.length; i += PLAYERS) {
        rows.push(this.history.slice(i, i+PLAYERS).map(card_symbol));
    }
    render_rows(tb, rows, 'td');
};

Game.prototype.render_chuck_history = function Game_render_chuck_history() {
    var a = [];
    for (var i = 0; i < this.chuck_history.length; ++i) {
        var o = this.chuck_history[i];
        var player = this.players[o.player];
        var card = card_desc(o.card);
        a.push(player+' drew '+card+': '+milliseconds_to_string(o.milliseconds));
        a.push('<br>');
    }
    this.el_chuck_history.innerHTML = a.join('');
};

function suit_to_char(i) {
    return SUITS[i].letter;
}

function number_to_char(i) {
    return '23456789TJQKA'.charAt(i-2);
}

function make_card(suit, n) {
    return suit_to_char(suit) + number_to_char(n);
}

function card_to_suit(card) {
    var suits = {};
    for (var i = 0; i < SUITS.length; ++i) suits[SUITS[i].letter] = i;
    return suits[card.charAt(0)];
}

function card_to_number(card) {
    var ns = {'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
    return (ns[card.charAt(1)] || card.charAt(1)) | 0;
}

function make_deck(suits) {
    deck = [];
    for (var suit = 0; suit < suits; ++suit) {
        for (var n = 2; n <= ACE; ++n) {
            var c = make_card(suit, n);
            deck.push(c);

            // Assertions for correctness
            if (suit != card_to_suit(c)) console.log("Bad suit: "+c);
            if (n != card_to_number(c)) console.log("Bad number: "+c);
        }
    }
    return deck;
}

function shuffled(a) {
    var r = [];
    while (a.length > 0) {
        r.push(a.splice((Math.random() * a.length) | 0, 1)[0]);
    }
    return r;
}

function make_shuffled_deck(suits) {
    return shuffled(make_deck(suits));
}

window.onload = function () {
    var ui_draw = function () { window.academy_game.ui_draw(); };
    var ui_chuck = function () { window.academy_game.ui_chuck(); };
    window.ui_save = function (form) { window.academy_game.ui_save(form); };
    var ui_shuffle = function () { window.academy_game.ui_shuffle(); };
    React.renderComponent(
<div>
<div className="layout_row">
<div style={{'float': 'left'}}>
    <table id="deck"></table>
</div>
<div style={{'float': 'left'}}>
    <input className="draw_button" type="button" value="Draw next card" onClick={ui_draw} />
    <input className="shuffle_button" type="button" value="Shuffle" onClick={ui_shuffle} />
</div>
</div>
<div className="layout_row">
<div className="state" id="playerstates">
<div id="playerstatetemplate">
    <div className="statecolumn">
        <div className="playerstate">
            <div className="card"></div>
            <div className="name"></div>
            <div>
                <div className="label">Remaining:</div>
                <div className="remaining"></div>
            </div>
            <div>
                <div className="label">Sips:</div>
                <div className="sips"></div>
            </div>
            <div>
                <div className="label">Beers:</div>
                <div className="beers"></div>
            </div>
            <div>
                <div className="label">Average:</div>
                <div className="average"></div>
            </div>
        </div>
    </div>
</div>
</div>
</div>

<div className="layout_row">
<div className="history">
<table id="history" style={{'text-align': 'center'}}>
</table>
</div>

<div className="chucks">
<div id="chuck_history">
</div>
<div className="chuck">
    <span id="chuck"></span><br />
    <input type="button" value="Start/stop" onClick={ui_chuck} />
</div>
</div>
</div>
</div>,
document.getElementById('game_area'));

    var elem_by_id = function (i) { return document.getElementById(i); };
    var game_config = JSON.parse(elem_by_id('game_configuration').value);
    window.academy_game = new Game(elem_by_id, game_config);
    window.addEventListener('keypress', function (ev) {
        if (ev.charCode == ' '.charCodeAt(0)) {
            ui_draw();
        }
    }, false);
};
