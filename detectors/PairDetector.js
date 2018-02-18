const Cards = require('../Cards');
const Detector = require('./Detector');
const {getKicker} = require('./helpers');

class PairDetector extends Detector {
  isOfType() {
    const index = this.numberOfEachCard.lastIndexOf(2);

    if (index > 0) {
      this.numberOfEachCard[index] = 0;

      return this.createReturnValue(
        `Pair ${Cards.getFaceStringByIndex(index)}`,
        index,
        getKicker(this.numberOfEachCard)
      );
    }
  }
}

module.exports = PairDetector;
