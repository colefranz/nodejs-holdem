const Cards = require('../Cards');
const Detector = require('./Detector');
const {getKicker} = require('./helpers');

class TwoPairDetector extends Detector {
  isOfType() {
    const firstPairIndex = this.numberOfEachCard.lastIndexOf(2);
    const secondPairIndex = this.numberOfEachCard.slice(0, firstPairIndex).lastIndexOf(2);

    if (firstPairIndex > 0 && secondPairIndex > 0) {
      const firstPair = Cards.getFaceStringByIndex(firstPairIndex);
      const secondPair = Cards.getFaceStringByIndex(secondPairIndex);
      this.numberOfEachCard[firstPairIndex] = 0;
      this.numberOfEachCard[secondPairIndex] = 0;

      return this.getQuality(
        `Two pair ${firstPair} and ${secondPair}`,
        parseInt(`${firstPairIndex}${secondPairIndex}`),
        getKicker(this.numberOfEachCard)
      );
    }
  }
}

module.exports = TwoPairDetector;
