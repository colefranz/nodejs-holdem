class Detector {
  constructor(cards, ofHand) {
    this.cards = cards;
    this.ofHand = ofHand;
    this.numberOfEachCard = this.flattenWithOperator(cards, add);
  }

  isOfType() {}

  getQuality(asString, ofHighCard = 0, ofKicker = 0) {
    return {
      asString: asString,
      ofHighCard: ofHighCard,
      ofKicker: ofKicker,
      ofHand: this.ofHand
    };
  }

  flattenWithOperator(mat, operator) {
    const flattenedMatrix = [];

    for (let i = 0; i < mat[0].length; i++) {
      flattenedMatrix.push(0);
      for (let j = 0; j < mat.length; j++) {
        flattenedMatrix[i] = operator(flattenedMatrix[i], mat[j][i]);
      }
    }

    return flattenedMatrix;
  }

  getKicker(flattenedCards) {
    let kicker = -1;

    for (let i = flattenedCards.length - 1; i >= 0; i--) {
      if (flattenedCards[i] > 0) {
        kicker = i;

        break;
      }
    }

    return kicker;
  }
}

function add(first, second) {
  return first + second;
}

function or(first, second) {
  return first | second;
}

module.exports = Detector;
