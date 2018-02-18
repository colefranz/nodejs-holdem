const {flattenWithOperator, add, getKicker} = require('./helpers');

class Detector {
  constructor(cards, ofHand) {
    this.cards = cards;
    this.ofHand = ofHand;
    this.numberOfEachCard = flattenWithOperator(cards, add);
  }

  isOfType() {}

  getQuality(asString, ofHighCard = 0, ofKicker = 0) {
    return {
      asString: asString,
      ofHighCard: ofHighCard,
      ofKicker: ofKicker,
      ofHand: this.ofHand
    };
  }
}

module.exports = Detector;
