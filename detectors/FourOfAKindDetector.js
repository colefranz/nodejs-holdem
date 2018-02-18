const Cards = require('../Cards');
const Detector = require('./Detector');

class FourOfAKindDetector extends Detector {
  isOfType() {
    const index = this.numberOfEachCard.lastIndexOf(4);

    if (index > 0) {
      this.numberOfEachCard[index] = 0;
      return this.getQuality(
        `Four of a Kind ${Cards.getFaceStringByIndex(index)}`,
        index,
        this.getKicker(this.numberOfEachCard)
      );
    }
  }
}

module.exports = FourOfAKindDetector;
