const Cards = require('../Cards');
const Detector = require('./Detector');

class FullHouseDetector extends Detector {
  isOfType() {
    const tripleIndex = this.numberOfEachCard.lastIndexOf(3);
    const doubleIndex = this.numberOfEachCard.lastIndexOf(2);

    if (tripleIndex > 0 && doubleIndex > 0) {
      const tripleFaceString = Cards.getFaceStringByIndex(tripleIndex);
      const doubleFaceString = Cards.getFaceStringByIndex(doubleIndex);

      return this.getQuality(
        `Full House ${tripleFaceString}s full of ${doubleFaceString}s`,
        parseInt(`${tripleIndex}${doubleIndex}`)
      );
    }
  }
}

module.exports = FullHouseDetector;
