const Cards = require('../Cards');
const helpers = require('./helpers');
const Detector = require('./Detector');

class StraightFlushDetector extends Detector {
  isOfType() {
    const acesAtStart = helpers.cardsWithAcesAtFrontAndBack(this.cards);

    for (let suitIndex = 0; suitIndex < acesAtStart.length; suitIndex++) {
      const tailIndex = helpers.getTailIndexOfStraight(acesAtStart[suitIndex]);

      if (tailIndex > 0) {
        const suitString = Cards.getSuitStringByIndex(suitIndex);

        return this.createReturnValue(
          `${suitString} Straight ${Cards.getFaceStringByIndex(tailIndex - 1)}`,
          tailIndex
        );
      }
    }
  }
}

module.exports = StraightFlushDetector;
