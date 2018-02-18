const Cards = require('../Cards');
const {getKicker} = require('./helpers');
const Detector = require('./Detector');

class HighCardDetector extends Detector {
  isOfType() {
    return this.getQuality(
      'High Card',
      getKicker(this.numberOfEachCard)
    );
  }
}

module.exports = HighCardDetector;
