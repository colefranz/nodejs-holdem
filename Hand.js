const Cards = require('./Cards');
const detectors = require('./detectors/detectors');

class Hand {
  constructor(cards) {
    this.cards = cards;
  }

  determineQualityOfHand() {
    let qualityOfHand;

    for (let i = 0; i < detectors.length; i++) {
      qualityOfHand = this.detectWith(detectors[i], detectors.length - i);

      if (qualityOfHand !== undefined) {
        break;
      }
    };

    return qualityOfHand;
  }

  // initially had all detectors in this file - leaving so as to not have to refactor every unit test
  // perhaps the unit tests could have been set up for better sustainability but I don't think so
  detectWith(Detector, quality) {
    const detector = new Detector(this.cards, quality);

    return detector.isOfType();
  }

  detectStraightFlush() {
    return this.detectWith(detectors[0]);
  }

  detectFourOfAKind() {
    return this.detectWith(detectors[1]);
  }

  detectFullHouse() {
    return this.detectWith(detectors[2]);
  }

  detectFlush() {
    return this.detectWith(detectors[3]);
  }

  detectStraight() {
    return this.detectWith(detectors[4]);
  }

  detectThreeOfAKind() {
    return this.detectWith(detectors[5]);
  }

  detectTwoPair() {
    return this.detectWith(detectors[6]);
  }

  detectPair() {
    return this.detectWith(detectors[7]);
  }

  highCard() {
    return this.detectWith(detectors[8]);
  }
  // end of detectors
}

module.exports = Hand;
