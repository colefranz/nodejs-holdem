const Hand = require('./Hand');
const Cards = require('./Cards');

class Player {
  constructor(name, cards, communityCards) {
    this.name = name;
    this.hand = new Hand(cards.join(communityCards.value));
  }

  getQualityOfHand() {
    return this.hand.determineQualityOfHand();
  }
}

module.exports = Player;
