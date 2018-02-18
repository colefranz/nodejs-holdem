const Cards = require('../Cards');
const Detector = require('./Detector');

class StraightDetector extends Detector {
  isOfType() {
    // add ace to front
    const acesAtStart = this.cardsWithAcesAtFrontAndBack(this.cards);

    // flatten all suits into one as they don't matter
    const cardArray = this.flattenWithOperator(acesAtStart, or);

    // get the tail index of a straight
    const tailIndex = this.getTailIndexOfStraight(cardArray);

    if (tailIndex !== -1) {
      return this.getQuality(
        `Straight ${Cards.getFaceStringByIndex(tailIndex - 1)}`,
        tailIndex
      );
    }
  }

  getTailIndexOfStraight(straight) {
    const straightMatcher = '11111';
    const cardsAsString = straight.join('');
    const headOfStraight = cardsAsString.lastIndexOf(straightMatcher);

    if (headOfStraight !== -1) {
      return headOfStraight + straightMatcher.length - 1;
    }

    return headOfStraight;
  }

  cardsWithAcesAtFrontAndBack (cards) {
    return cards.slice(0).map(function(faces) {
      const facesCopy = faces.slice(0);

      facesCopy.unshift(faces[faces.length - 1]);

      return facesCopy;
    });
  }
}

function or(first, second) {
  return first | second;
}


module.exports = StraightDetector;
