/** @jsx React.DOM */
// vim: set ft=javascript sw=4 et:
///////////////////////////////////////////////////////////////////////////////
// Configuration provided by server side
///////////////////////////////////////////////////////////////////////////////

var config = config;
SUITS = config['suits'].map(function (a) { return {letter: a[0], name: a[1], color: a[2], symbol: a[3]}; });

ACE = 14;
SIPS = 14;

var BeerImage = React.createClass({
    waterLevel: function (fraction) {
        var ymin = 65, ymax = 289;
        var y = (ymin + fraction * (ymax - ymin)) | 0;
        var xminmax = [25,56,25,56,25,57,25,57,25,57,24,58,24,58,24,58,24,58,
            24,58,23,58,23,58,23,58,24,58,25,56,26,56,26,56,26,56,26,56,26,56,
            26,56,26,56,26,56,26,56,26,56,26,56,26,56,26,56,26,56,25,56,25,57,
            25,57,25,57,25,57,25,57,25,57,25,57,25,57,25,57,25,57,25,57,25,57,
            24,58,24,58,24,58,24,58,24,58,24,58,24,58,24,59,23,59,23,59,23,59,
            23,59,23,59,23,59,23,60,22,60,22,60,22,60,22,60,22,60,22,61,22,61,
            21,61,21,61,21,61,21,61,21,62,20,62,20,62,20,62,20,62,20,63,20,63,
            19,63,19,63,19,63,19,64,19,64,18,64,18,64,18,64,18,65,17,65,17,65,
            17,65,17,66,17,66,16,66,16,66,16,67,16,67,15,67,15,67,15,67,15,68,
            15,68,14,68,14,69,14,69,14,69,13,69,13,70,13,70,12,70,12,70,12,71,
            12,71,11,71,11,72,11,72,10,72,10,72,10,73,10,73,9,73,9,74,9,74,8,
            74,8,75,8,75,7,75,7,75,7,76,7,76,6,76,6,77,6,77,6,77,5,77,5,78,5,
            78,5,78,4,78,4,78,4,79,4,79,4,79,4,79,3,79,3,79,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,
            80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,80,3,81,3,
            81,3,81,3,81,3,81,3,81,3,81,3,81,3,81,3,81,3,81,3,81,3,81,3,81,3,
            80,3,80,3,80,3,80,3,80,4,80,4,80,4,80,4,79,5,78,6,77,8,74,13,68,29,
            50,0,0];
        var xmin = xminmax[2*y], xmax = xminmax[2*y+1];
        return {y: y, xmin: xmin, xmax: xmax};
    },
    render: function () {
        var sips = this.props.sips;
        var remaining = this.props.remaining;
        var fraction = 1 - remaining / sips;
        var scale = this.props.height / 290;
        var waterLevelData = this.waterLevel(fraction);
        var y = waterLevelData.y;
        var xmin = waterLevelData.xmin;
        var xmax = waterLevelData.xmax;
        var aspect = 80/300;
        var height = this.props.height;
        var full = <div style={{
                'overflow': 'hidden',
                'position': 'absolute',
                'top': scale*y+'px', 'left': '0px'}}>
            <img src="/static/beer-full.png" style={{
                //'position': 'absolute',
                'verticalAlign': 'top',
                'marginTop': -scale*y+'px',
                'height': height+'px'}} />
        </div>;
        var empty = <div style={{
                'overflow': 'hidden',
                'position': 'absolute',
                'top': '0px', 'left': '0px'}}>
            <img src="/static/beer-empty.png" style={{'height': height+'px'}} />
        </div>;
        var waterLevel = <div style={{
                'position': 'absolute',
                'top': scale*y + 'px',
                'left': scale*xmin + 'px',
                'width': scale*(xmax - xmin) + 'px',
                'borderTop': '3px solid black',
        }} />;
        var sipsLabel;
        if (fraction > 5/14) {
            sipsLabel = <div style={{
                'position': 'absolute',
                'bottom': (height - scale*y) + 'px',
                'left': '0px',
                'height': '1em',
                'width': '100%',
                'textAlign': 'center'}}>{remaining}</div>;
        } else {
            sipsLabel = <div style={{
                'position': 'absolute',
                'top': scale*Math.max(y+10, 120) + 'px',
                'left': '0px',
                'height': '1em',
                'width': '100%',
                'textAlign': 'center'}}>{remaining}</div>;
        }
        return <div style={{
                'display': 'inline-block',
                'position': 'relative',
                'height': height + 'px',
                'width': aspect * height + 'px'
        }}>{empty}{full}{waterLevel}{sipsLabel}</div>;
    }
});

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
        if (startTime != null) {
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
    tick: function () {
        if (this.isMounted()) {
            this.setState({});
            window.requestAnimationFrame(this.tick);
        }
    },
    start: function () {
        this.setState({startTime: new Date().getTime(), stopTime: null});
        window.requestAnimationFrame(this.tick);
    },
    stop: function () {
        var st = {startTime: this.state.startTime, stopTime: new Date().getTime()};
        this.setState(st);
        this.props.onChuckSubmit(st.startTime, st.stopTime);
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
        var chuckButton = '';
        if (this.is_chucking()) {
            chuckButton = <ChuckButton onChuckSubmit={this.submit_chuck} />;
        }
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
            <ChuckHistory data={this.chuck_history()} players={this.props.players} />
            {chuckButton}
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
                {with_label("Remaining:", <div className="remaining">
                            <BeerImage height={64} sips={SIPS} remaining={remaining} /></div>)}
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
            var player = this.props.players[o.player];
            lines.push(<div key={i}>
                       {player} drew {card_desc(o.card)}: {milliseconds_to_string(o.milliseconds)}</div>);
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
