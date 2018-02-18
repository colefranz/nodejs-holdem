const Cards = require('../Cards');
const StraightDetector = require('./StraightDetector');

class StraightFlushDetector extends StraightDetector {
  isOfType() {
    const acesAtStart = this.cardsWithAcesAtFrontAndBack(this.cards);

    for (let suitIndex = 0; suitIndex < acesAtStart.length; suitIndex++) {
      const tailIndex = this.getTailIndexOfStraight(acesAtStart[suitIndex]);

      if (tailIndex > 0) {
        const suitString = Cards.getSuitStringByIndex(suitIndex);

        return this.getQuality(
          `${suitString} Straight ${Cards.getFaceStringByIndex(tailIndex - 1)}`,
          tailIndex
        );
      }
    }
  }
}

hasAtLeastFive = function(cards) {
  const numberOfCards = cards.reduce(function(count, item) {
    return count += item;
  }, 0);

  return numberOfCards >= 5;
}

module.exports = StraightFlushDetector;
