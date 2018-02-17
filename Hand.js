const Cards = require('./Cards');

class Hand {
  constructor(cards) {
    this.cards = cards;
    this.numberOfEachCard = flattenWithOperator(this.cards, add);
  }

  determineQualityOfHand() {
    const detectors = [
      this.detectStraightFlush,
      this.detectFourOfAKind,
      this.detectFullHouse,
      this.detectFlush,
      this.detectStraight,
      this.detectThreeOfAKind,
      this.detectTwoPair,
      this.detectPair,
      this.highCard,
    ];

    let qualityOfHand;

    for (let i = 0; i < detectors.length; i++) {
      qualityOfHand = detectors[i].call(this);

      if (qualityOfHand !== undefined) {
        qualityOfHand.quality = i;

        break;
      }
    };

    return qualityOfHand;
  }

  getKicker(cards) {
    const flattened = flattenWithOperator(cards, or);
    let kicker = -1;

    for (let i = flattened.length - 1; i >= 0; i--) {
      if (flattened[i] === 1) {
        kicker = i;

        break;
      }
    }

    return kicker;
  }

  detectStraightFlush() {
    const acesAtStart = cardsWithAcesAtFrontAndBack(this.cards);

    for (let suitIndex = 0; suitIndex < acesAtStart.length; suitIndex++) {
      const tailIndex = getTailIndexOfStraight(acesAtStart[suitIndex]);

      if (tailIndex > 0) {
        const suitString = Cards.getSuitStringByIndex(suitIndex);

        return createReturnValue(
          `${suitString} Straight ${Cards.getFaceStringByIndex(tailIndex - 1)}`,
          tailIndex
        );
      }
    }
  }

  detectFourOfAKind() {
    const index = this.numberOfEachCard.lastIndexOf(4);

    if (index > 0) {
      return createReturnValue(
        `Four of a Kind ${Cards.getFaceStringByIndex(index)}`,
        index
      );
    }
  }

  detectFullHouse() {
    const tripleIndex = this.numberOfEachCard.lastIndexOf(3);
    const doubleIndex = this.numberOfEachCard.lastIndexOf(2);

    if (tripleIndex > 0 && doubleIndex > 0) {
      const tripleFaceString = Cards.getFaceStringByIndex(tripleIndex);
      const doubleFaceString = Cards.getFaceStringByIndex(doubleIndex);

      return createReturnValue(
        `Full House ${tripleFaceString}s full of ${doubleFaceString}s`,
        parseInt(`${tripleIndex}${doubleIndex}`)
      );
    }
  }

  detectFlush() {
    for (let suitIndex = 0; suitIndex < Cards.getSuits().length; suitIndex++) {
      if (hasAtLeastFive(this.cards[suitIndex])) {

        return createReturnValue(`Flush ${Cards.getSuitStringByIndex(suitIndex)}`, 0)
      }
    }
  }

  detectStraight() {
    // add ace to front
    const acesAtStart = cardsWithAcesAtFrontAndBack(this.cards);

    // flatten all suits into one as they don't matter
    const cardArray = flattenWithOperator(acesAtStart, or);

    // get the tail index of a straight
    const tailIndex = getTailIndexOfStraight(cardArray);

    if (tailIndex !== -1) {
      return createReturnValue(
        `Straight ${Cards.getFaceStringByIndex(tailIndex - 1)}`,
        tailIndex
      );
    }
  }

  detectThreeOfAKind() {
    const index = this.numberOfEachCard.lastIndexOf(3);

    if (index > 0) {
      return createReturnValue(
        `Three of a Kind ${Cards.getFaceStringByIndex(index)}`,
        index
      );
    }
  }

  detectTwoPair() {
    const firstPairIndex = this.numberOfEachCard.lastIndexOf(2);
    const secondPairIndex = this.numberOfEachCard.slice(0, firstPairIndex).lastIndexOf(2);

    if (firstPairIndex > 0 && secondPairIndex > 0) {
      const firstPair = Cards.getFaceStringByIndex(firstPairIndex);
      const secondPair = Cards.getFaceStringByIndex(secondPairIndex);

      return createReturnValue(
        `Two pair ${firstPair} and ${secondPair}`,
        parseInt(`${firstPairIndex}${secondPairIndex}`)
      );
    }
  }

  detectPair() {
    const index = this.numberOfEachCard.lastIndexOf(2);

    if (index > 0) {
      return createReturnValue(
        `Pair ${Cards.getFaceStringByIndex(index)}`,
        index
      );
    }
  }

  highCard() {
    return {
      output: "High Card",
      quality: 100,
      value: this.getKicker(this.cards)
    };
  }
}

function createReturnValue(asString, value) {
  return {
    asString: asString,
    value: value
  };
}

function getTailIndexOfStraight (arr) {
  const straightMatcher = '11111';
  const cardsAsString = arr.join('');
  const headOfStraight = cardsAsString.lastIndexOf(straightMatcher);

  if (headOfStraight !== -1) {
    return headOfStraight + straightMatcher.length - 1;
  }

  return headOfStraight;
}

function hasAtLeastFive (cards) {
  const numberOfCards = cards.reduce(function(count, item) {
    return count += item;
  }, 0);

  return numberOfCards >= 5;
}

function or (first, second) {
  return first | second;
}

function add (first, second) {
  return first + second;
}

function flattenWithOperator (mat, operator) {
  const flattenedMatrix = [];

  for (let i = 0; i < mat[0].length; i++) {
    flattenedMatrix.push(0);
    for (let j = 0; j < mat.length; j++) {
      flattenedMatrix[i] = operator(flattenedMatrix[i], mat[j][i]);
    }
  }

  return flattenedMatrix;
}

function cardsWithAcesAtFrontAndBack (cards) {
  return cards.slice(0).map(function(faces) {
    const facesCopy = faces.slice(0);

    facesCopy.unshift(faces[faces.length - 1]);

    return facesCopy;
  });
}

module.exports = Hand;
