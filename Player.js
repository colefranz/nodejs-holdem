const Hand = require('./Hand');

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
