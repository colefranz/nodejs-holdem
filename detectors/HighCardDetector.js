const Cards = require('../Cards');
const Detector = require('./Detector');

class HighCardDetector extends Detector {
  isOfType() {
    return this.getQuality(
      'High Card',
      this.getKicker(this.numberOfEachCard)
    );
  }
}

module.exports = HighCardDetector;
