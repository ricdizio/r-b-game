var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
var decks = 1;

var deck = new Array();

class Card {
	constructor(index, number, suit) {
		this.index = index;
		this.number = number;
		this.suit = suit;

		if (number == 'A') {
			this.value = 14;
		} else if (number == 'K'){
			this.value = 13;
		} else if (number == 'Q'){
			this.value = 12;
		} else if (number == 'J'){
			this.value = 11;
		} else {
			this.value = parseInt(number);
		}

		if (this.suit == "Hearts" || this.suit == "Diamonds") {
			this.color = true;
		}
		else {
			this.color = false;
		}
	}
}

for (var i = 0; i < decks; i++) {
    for (var j = 0; j < numbers.length; j++) {
        for (var k = 0; k < suits.length; k++) {
            deck.push(new Card(j * 4 + k, numbers[j], suits[k]));
        }
    }
}


module.exports = {
	deck: deck,
    get: function(){
        return deck;
    },
    shuffle: function(array){
        var newArray = array;
		var arrayLength = array.length;
		var randomNumber;
		var temp;

		while (arrayLength) {
			randomNumber = Math.floor(Math.random() * arrayLength--);
			temp = newArray[arrayLength];
			newArray[arrayLength] = newArray[randomNumber];
			newArray[randomNumber] = temp;
		}

		return newArray;
    },
    dealCard: function(array, remove) {
		var random = Math.floor(Math.random() * array.length);
		var card = array[random];
		if (remove) {
			array.splice(array.indexOf(card), 1);
		}
		return card;
	},
	dealCustomCard: function(array){ // Devuelve una carta que no se encuentre en el parametro array.
		var random;
		var card;
		do{
			random = Math.floor(Math.random() * deck.length);
			card = deck[random];
		} while(array.indexOf(card) >= 0);

		return card;
	},
	randomColor: function() {
		if (Math.random() > 0.5) {
			return true;
		}
		else {
			return false;
		}
	}
}