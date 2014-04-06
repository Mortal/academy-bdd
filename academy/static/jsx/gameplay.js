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

var ChuckButton = React.createClass({
    getInitialState: function () {
        return {startTime: null, stopTime: null};
    },
    milliseconds: function () {
        var startTime = this.state.startTime;
        var stopTime = this.state.stopTime || new Date().getTime();
        return new Date().getTime() - startTime;
    },
    render: function () {
        var startTime = this.state.startTime;
        if (this.props.disabled) {
            return <div />
        } else if (startTime != null) {
            var milliseconds = this.milliseconds();
            return <div>
                <div>{milliseconds_to_string(milliseconds)}</div>
                <input type="button" value="Stop" onClick={this.stop} />
            </div>;
        } else {
            return <div>
                <div>Start the time!</div>
                <input type="button" value="Start" onClick={this.start} />
            </div>;
        }
    },
    start: function () {
        this.setState({startTime: new Date().getTime(), stopTime: null});
    },
    stop: function () {
        this.setState({startTime: this.state.startTime, stopTime: new Date().getTime()});
        this.props.onChuckSubmit(this.milliseconds());
    }
});

///////////////////////////////////////////////////////////////////////////////
// Game runtime state.
///////////////////////////////////////////////////////////////////////////////

var Game = React.createClass({
    getInitialState: function () {
        return {cards_drawn: 0, chuck_history: [], is_chucking: false, times: []};
    },
    deck: function () {
        var cards = this.props.deck;
        return cards.slice(this.state.cards_drawn);
    },
    history: function () {
        var cards = this.props.deck;
        return cards.slice(0, this.state.cards_drawn);
    },
    chuck_history: function () {
        return this.state.chuck_history;
    },
    is_chucking: function () {
        return this.state.is_chucking;
    },
    render: function () {
        var suits = [];
        for (var suit = 0; suit < this.props.suits; ++suit) suits.push(suit);
        return (
            <div>
            <div className="layout_row">
            <div style={{'float': 'left'}}>
                <Deck suits={suits} deck={this.deck()} />
            </div>
            <div style={{'float': 'left'}}>
                <input className="draw_button" type="button" value="Draw next card" onClick={this.ui_draw} />
                <input className="shuffle_button" type="button" value="Shuffle" onClick={this.ui_shuffle} />
            </div>
            </div>
            <div className="layout_row">
            <PlayerStates players={this.props.players} history={this.history()} />
            </div>

            <div className="layout_row">
            <div className="history">
            <History players={this.props.players} history={this.history()} />
            </div>

            <div className="chucks">
            <ChuckHistory data={this.chuck_history()} />
            <ChuckButton disabled={!this.is_chucking()} onChuckSubmit={this.submit_chuck} />
            </div>
            </div>
            </div>);
    },

    submit_chuck: function (start, stop) {
        var st = this.state;
        var history = this.history();
        var players = this.props.players;
        st.is_chucking = false;
        st.chuck_history.push({
            player: (history.length - 1) % players.length,
            card: history[history.length - 1],
            start: start,
            stop: stop,
            milliseconds: stop - start
        });
        this.setState(st);
    },

    // Button handler: Draw card
    ui_draw: function () {
        if (this.is_chucking()) return;
        var deck = this.deck();
        if (deck.length == 0) return;
        var card = deck[0];
        var times = this.state.times.slice();
        times.push(new Date().getTime());
        var is_chucking = false;
        if (card_to_number(card) == ACE) {
            is_chucking = true;
        }
        var state = {
            is_chucking: is_chucking,
            cards_drawn: this.state.cards_drawn + 1,
            times: times,
            chuck_history: this.state.chuck_history
        };
        this.setState(state);
    },

    // Button handler: Upload game
    ui_save: function () {
        // TODO
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
    },

    // Button handler: Shuffle
    ui_shuffle: function () {
        console.log("Shuffling deck...");
        for (var i = 0; i < 52; ++i) {
            return this.cards[i];
        }
    }
});

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

var Card = React.createClass({
    suitSymbol: function () {
        return SUITS[this.props.suit].symbol;
    },
    suitColor: function () {
        return SUITS[this.props.suit].color;
    },
    render: function () {
        var number = this.props.number <= 10 ? this.props.number : 'JQKA'.charAt(this.props.number - 11);
        return (
            <span className="card suit_{this.suitLetter()}">
                <span style={{'color': this.suitColor()}}>{this.suitSymbol()}</span>{number}
            </span>
        );
    }
});

var Deck = React.createClass({
    render: function () {
        var rows = [];
        for (var i = 0; i < this.props.suits.length; ++i) {
            var row = [];
            var suit = this.props.suits[i];
            for (var n = 2; n <= ACE; ++n) {
                var c = make_card(suit, n);
                if (this.props.deck.indexOf(c) == -1)
                    row.push(<td key={c}>&mdash;</td>);
                else
                    row.push(<td key={c}><Card suit={suit} number={n} /></td>);
            }
            rows.push(<tr key={i}>{row}</tr>);
        }
        return (
            <table id="deck">{rows}</table>
        );
    }
});

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
    return (
        <span>
            <span className={'number_'+number}>{number_name}</span>
            {" of "}
            <span style={{'color': suit_color}}>{suit_name}</span>
        </span>
    );
}

var PlayerState = React.createClass({
    render: function () {
        var card = this.props.last_card ? card_desc(this.props.last_card) : <span>&mdash;</span>;
        var name = <div className="name">{this.props.player}</div>;
        var beers = (this.props.sips / SIPS) | 0;
        var remaining = (1 + beers) * SIPS - this.props.sips;
        var average = (this.props.rounds ? round_100(this.props.sips / this.props.rounds) : '0');
        function with_label(label, value) {
            return <div><div className="label">{label}</div>{value}</div>;
        }
        return (
            <div className={"playerstate position"+this.props.position}>
                <div className="card">{card}</div>
                {name}
                {with_label("Remaining:", <div className="remaining">{remaining}</div>)}
                {with_label("Sips:", <div>{this.props.sips}</div>)}
                {with_label("Beers:", <div>{beers}</div>)}
                {with_label("Average:", <div>{average}</div>)}
            </div>
        );
    }
});

var PlayerStates = React.createClass({
    render: function () {
        var players = this.props.players;
        var history = this.props.history;
        var sips = [];
        var n = [];
        for (var i = 0; i < players.length; ++i) {
            sips.push(0);
            n.push(0);
            for (var j = i; j < history.length; j += players.length) {
                sips[i] += card_to_number(history[j]);
                ++n[i];
            }
        }
        var positions = new Array(players.length);
        var standings = sips.slice().map(function (s, i) { return [s, i]; });
        standings.sort(function (a, b) { return b[0] - a[0]; });
        for (var i = 0; i < players.length; ++i) {
            if (i > 0 && standings[i][0] == standings[i-1][0]) {
                positions[standings[i][1]] = positions[standings[i-1][1]];
            } else {
                positions[standings[i][1]] = i+1;
            }
        }
        var columns = [];
        for (var i = 0; i < players.length; ++i) {
            var card = (history.length <= i) ? null : (
                history[players.length * (((history.length - i - 1) / players.length) | 0) + i]);

            columns.push(<div key={i} className="statecolumn">
                <PlayerState last_card={card} player={players[i]} sips={sips[i]} rounds={n[i]}
                position={positions[i]} />
            </div>);
        }
        return (
            <div id="playerstates" className="state">
            {columns}
            </div>
        );
    }
});

var History = React.createClass({
    render: function () {
        var history = this.props.history;
        var players = this.props.players;
        var headerCells = [];
        for (var i = 0; i < players.length; ++i) {
            headerCells.push(<th key={i}>{players[i]}</th>);
        }
        var header = <thead><tr>{headerCells}</tr></thead>;
        var rows = [];
        for (var i = 0; i < history.length; i += players.length) {
            var cells = history.slice(i, i+players.length).map(function (c) {
                return <td key={c}><Card suit={card_to_suit(c)} number={card_to_number(c)} /></td>;
            });
            rows.push(<tr key={i}>{cells}</tr>);
        }
        var body = <tbody>{rows}</tbody>;
        return <table id="history" style={{'text-align': 'center'}}>{header}{body}</table>;
    }
});

var ChuckHistory = React.createClass({
    render: function () {
        var lines = [];
        var chuck_history = this.props.data;
        for (var i = 0; i < chuck_history.length; ++i) {
            var o = chuck_history[i];
            lines.push(<div key={i}>
                       {o.player} drew {card_desc(o.card)}: {milliseconds_to_string(o.milliseconds)}</div>);
        }
        return <div>{lines}</div>;
    }
});

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
    var game_config = JSON.parse(document.getElementById('game_configuration').value);
    var players = game_config.players;
    var suits = players.length;
    var deck = make_shuffled_deck(suits);
    React.renderComponent(<Game players={players} deck={deck} suits={suits} />,
        document.getElementById('game_area'));
    /*
    window.addEventListener('keypress', function (ev) {
        if (ev.charCode == ' '.charCodeAt(0)) {
            ui_draw();
        }
    }, false);
    */
};
