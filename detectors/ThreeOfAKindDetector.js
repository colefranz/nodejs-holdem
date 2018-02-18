const Cards = require('../Cards');
const Detector = require('./Detector');

class ThreeOfAKindDetector extends Detector {
  isOfType() {
    const index = this.numberOfEachCard.lastIndexOf(3);

    if (index > 0) {
      this.numberOfEachCard[index] = 0;
      return this.getQuality(
        `Three of a Kind ${Cards.getFaceStringByIndex(index)}`,
        index,
        this.getKicker(this.numberOfEachCard)
      );
    }
  }
}

module.exports = ThreeOfAKindDetector;
