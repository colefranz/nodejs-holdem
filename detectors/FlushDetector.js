const Cards = require('../Cards');
const Detector = require('./Detector');

class FlushDetector extends Detector {
  isOfType() {
    for (let suitIndex = 0; suitIndex < Cards.getSuits().length; suitIndex++) {
      if (hasAtLeastFive(this.cards[suitIndex])) {

        return this.getQuality(`Flush ${Cards.getSuitStringByIndex(suitIndex)}`, 0)
      }
    }
  }
}

module.exports = FlushDetector;
