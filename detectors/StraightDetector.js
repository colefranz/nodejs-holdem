const Cards = require('../Cards');
const Detector = require('./Detector');
const {
  flattenWithOperator,
  or,
  cardsWithAcesAtFrontAndBack,
  getTailIndexOfStraight,
} = require('./helpers');

class StraightDetector extends Detector {
  isOfType() {
    // add ace to front
    const acesAtStart = cardsWithAcesAtFrontAndBack(this.cards);

    // flatten all suits into one as they don't matter
    const cardArray = flattenWithOperator(acesAtStart, or);

    // get the tail index of a straight
    const tailIndex = getTailIndexOfStraight(cardArray);

    if (tailIndex !== -1) {
      return this.getQuality(
        `Straight ${Cards.getFaceStringByIndex(tailIndex - 1)}`,
        tailIndex
      );
    }
  }
}

module.exports = StraightDetector;
