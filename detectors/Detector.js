const {flattenWithOperator, add, getKicker} = require('./helpers');

class Detector {
  constructor(cards, quality) {
    this.cards = cards;
    this.quality = quality;
    this.numberOfEachCard = flattenWithOperator(cards, add);
  }

  isOfType() {}

  createReturnValue(asString, value = 0, kicker = 0) {
    return {
      asString: asString,
      value: value,
      kicker: kicker,
      quality: this.quality
    };
  }
}

module.exports = Detector;
