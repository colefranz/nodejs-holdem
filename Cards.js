const suits = ['h', 'd', 's', 'c'];
const suitsStrings = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
const faceValues = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'];
const faceValuesString = [
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Jack',
  'Queen',
  'King',
  'Ace'
];

class Cards {
  static deck() {

  }
  static getSuits() {
    return suits;
  }

  static getFaceValues() {
    return faceValues;
  }

  static getSuitNameByIndex(index) {
    return suits[index];
  }

  static getFaceValueByIndex(index) {
    return faceValues[index];
  }

  static getSuitStringByIndex(index) {
    return suitsStrings[index];
  }

  static getFaceStringByIndex(index) {
    return faceValuesString[index];
  }

  constructor() {
    // 2d array of suits and values, all 0
    this.ofHighCard = suits.map(function(suit) {
      return new Array(faceValues.length).fill(0);
    });
  }

  addCard(face, suit) {
    const faceIndex = faceValues.indexOf(face.toLowerCase());
    const suitIndex = suits.indexOf(suit.toLowerCase());

    if (faceIndex === -1) {
      throw new Error(`${face} is not a valid face ofHighCard`);
    }

    if (suitIndex === -1) {
      throw new Error(`${suit} is not a valid suit`);
    }

    if (this.ofHighCard[suitIndex][faceIndex] != 0) {
      throw new Error('You may not duplicate the card');
    }

    this.ofHighCard[suitIndex][faceIndex] = 1;
  }

  join(otherCards) {
    return this.ofHighCard.map(function(faces, suitIndex) {
      return faces.map(function(faceValue, faceIndex) {
        return faceValue | otherCards[suitIndex][faceIndex];
      });
    });
  }
}

module.exports = Cards;
