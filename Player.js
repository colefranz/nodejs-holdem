const Hand = require('./Hand');
const Cards = require('./Cards');

class Player {
  constructor(name, cards, communityCards) {
    this.name = name;
    this.hand = new Hand(cards.join(communityCards.ofHighCard));
  }

  getQualityOfHand() {
    return this.hand.quality;
  }
}

module.exports = Player;
