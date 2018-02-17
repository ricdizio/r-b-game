class Card {
	constructor(index, number, suit) {
		this.index = index;
		this.number = number;
		this.suit = suit;

		if (number == 'A') {
			this.value = 11;
		}
		else {
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