const Cards = require('../Cards');
const Detector = require('./Detector');

class PairDetector extends Detector {
  isOfType() {
    const index = this.numberOfEachCard.lastIndexOf(2);

    if (index > 0) {
      this.numberOfEachCard[index] = 0;

      return this.getQuality(
        `Pair ${Cards.getFaceStringByIndex(index)}`,
        index,
        this.getKicker(this.numberOfEachCard)
      );
    }
  }
}

module.exports = PairDetector;
