Array.prototype.removeAt = function(index) {
	if (index < 0 || index >= this.length) {
		return;
	}

	for (var i = index; i < this.length; i++) {
		this[i] = this[i + 1];
	}

	this.pop();
};

function Card(name, value) {
	this.name = name;
	this.value = value;
}

function Deck() {
	this.cards = [];

	// Reset cards on initialization
	this.reset();
}

Deck.prototype.reset = function() {
	var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
	var types = {"Ace": [1, 11], "Jack": 10, "Queen": 10, "King": 10, "10": 10, "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2}

	for (var i = 0; i < suits.length; i++) {
		var suit = suits[i];

		for (type in types) {
			this.cards.push(new Card((suit + "_" + type), types[type]));
		}
	}
}

Deck.prototype.shuffle = function() {
	for (var i = 0; i < this.cards.length; i++) {
		var randomIndex = randrange(i, this.cards.length - 1);

		if (randomIndex != i) {
			var temp = this.cards[i];
			this.cards[i] = this.cards[randomIndex];
			this.cards[randomIndex] = temp;
		}
	}
};

Deck.prototype.deal = function(player, amount) {
	console.log(' ');

	for (var i = 0; i < amount; i++) {
		var random_card = randrange(0, this.cards.length - 1);
		player.cards_in_hand.push(this.cards[random_card]);
		console.log("(" + player.name + ") Added Card " + this.cards[random_card].name);
		this.cards.removeAt(random_card);
	}

	console.log(' ');
}

function Player(name) {
	this.name = name;
	this.score = 0;
	this.cards_in_hand = [];

	// Dealer will be selected randomly, default is false
	this.is_dealer = false;
}

Player.prototype.handleCards = function(deck) {
	this.revealCards();

	if (this.score == 21) {
		console.log(this.name + ": Blackjack");
	} else {
		console.log(this.name + ": Failed to get Blackjack, current score is " + this.score);

		while (this.score <= 21) {
			if (this.score == 21) {
				console.log(this.name + ": Blackjack");
				break;
			}

			// Decide if player should hit the card randomly
			var shouldHit = randrange(0, 1) == 0;

			if (shouldHit) {
				deck.deal(this, 1);
				this.revealCards();
				console.log(this.name + ": Hit a Card, Updated score is " + this.score);
			} else {
				console.log(this.name + ": Quit, Updated score is " + this.score);
				break;
			}
		}

		if (this.score > 21) {
			console.log(this.name + ": Lost");
		}
	}
};

Player.prototype.revealCards = function() {
	var to_remove = [];
	console.log(' ');

	for (var i = 0; i < this.cards_in_hand.length; i++) {
		var card = this.cards_in_hand[i];

		if (card.value instanceof Array) {
			if (this.score >= 10) {
				this.score += 11;
				console.log("(" + this.name + ") Revealed Card " + card.name + ", added 11 to score");
			} else {
				this.score += 1;
				console.log("(" + this.name + ") Revealed Card " + card.name + ", added 1 to score");
			}
		} else {
			this.score += card.value;
			console.log("(" + this.name + ") Revealed Card " + card.name + ", added " + card.value + " to score");
		}
	}

	console.log(' ');
	this.cards_in_hand = [];
};

function randrange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function select_random_dealer(players) {
	var random_player = players[randrange(0, players.length - 1)];
	random_player.is_dealer = true;
	return random_player;
}

deck = new Deck();
players = [ new Player("TestPlayer1"), new Player("TestPlayer2"), new Player("TestPlayer3") ];
dealer = select_random_dealer(players);

// Deal 2 cards to each player
for (var i = 0; i < players.length; i++) {
	deck.deal(players[i], 2);
}

for (var i = 0; i < players.length; i++) {
	players[i].handleCards(deck);
}

var winners = [];
var dealer_score = dealer.score;

if (dealer_score > 21) {
	for (var i = 0; i < players.length; i++) {
		var player = players[i];

		if (!player.is_dealer && 21 >= player.score) {
			winners.push(player.name);
		}
	}
} else {
	var higher_scored_players = 0;

	for (var i = 0; i < players.length; i++) {
		var player = players[i];

		if (!player.is_dealer && 21 >= player.score > dealer_score) {
			higher_scored_players++;
			winners.push(player.name);
		}
	}

	if (higher_scored_players != players.length - 1) {
		winners = dealer.name;
	}
}

console.log(' ');
console.log("Dealer was " + dealer.name + ". Dealers Score: " + dealer.score);
console.log("Winners: " + winners);