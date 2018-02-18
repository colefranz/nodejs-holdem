// ghetto test suite
const assert = require('assert');

const Player = require('../Player');
const Cards = require('../Cards');
const Hand = require('../Hand');
const Holdem = require('../Holdem');

describe('cards', function() {
  describe('when created', function() {
    it('should initialize the empty set of cards', function() {
      const cards = new Cards();

      assert(cards.value.length === 4);
      assert(cards.value[0].length === 13);
      assert(cards.value[1].length === 13);
      assert(cards.value[2].length === 13);
      assert(cards.value[3].length === 13);
    });

    it('should be able to add a card', function() {
      const cards = new Cards();
      cards.addCard('3', 'h')
      cards.addCard('2', 'd')

      assert(cards.value[0][1] === 1);
      assert(cards.value[1][0] === 1);
    });

    it('should throw if the new card is already in the desk', function() {
      const cards = new Cards();
      cards.addCard('3', 'h');

      assert.throws(() => {
        cards.addCard('3', 'h');
      });
    });
  });
});

describe('Hand', function() {
  describe('when checking for four of a kind', function() {
    it('should properly detect a four of a kind', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('3', 'd');
      cards.addCard('3', 's');
      cards.addCard('3', 'c');
      cards.addCard('a', 'c');
      cards.addCard('q', 'c');

      const hand = new Hand(cards.value);

      assert(hand.detectFourOfAKind().asString === "Four of a Kind Three");
      assert(hand.detectFourOfAKind().kicker === 12);
    });

    it('should return undefined for three of a kind', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('3', 's');
      cards.addCard('3', 'c');

      const hand = new Hand(cards.value);

      assert(hand.detectFourOfAKind() === undefined);
    });

    it('should return undefined for one of each suit that arent of a kind', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('2', 'd');
      cards.addCard('3', 's');
      cards.addCard('4', 'c');

      const hand = new Hand(cards.value);

      assert(hand.detectFourOfAKind() === undefined);
    });
  });

  describe('when checking for a flush', function() {
    it('should properly detect a flush', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('7', 'h');
      cards.addCard('8', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectFlush().asString === 'Flush Hearts');
    });

    it('should return undefined for 4 of the same suit', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('7', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectFlush() === undefined);
    });
  });

  describe('when checking for a straight', function() {
    it('should properly detect a straight', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'd');
      cards.addCard('5', 's');
      cards.addCard('6', 's');
      cards.addCard('7', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectStraight().asString === 'Straight Seven');
    });

    it('should properly use the highest number when there are more than 5 in a row', function() {
      const cards = new Cards();

      cards.addCard('2', 'h');
      cards.addCard('3', 'h');
      cards.addCard('4', 'd');
      cards.addCard('5', 's');
      cards.addCard('6', 's');
      cards.addCard('7', 's');
      cards.addCard('8', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectStraight().asString === 'Straight Eight');
    });

    it('should properly detect a straight with a big ace', function() {
      const cards = new Cards();

      cards.addCard('t', 'h');
      cards.addCard('j', 'd');
      cards.addCard('q', 's');
      cards.addCard('k', 's');
      cards.addCard('a', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectStraight().asString === 'Straight Ace');
    });

    it('should not detect a straight with wrapping past the small ace', function() {
      const cards = new Cards();

      cards.addCard('j', 'd');
      cards.addCard('q', 's');
      cards.addCard('k', 's');
      cards.addCard('a', 'h');
      cards.addCard('2', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectStraight() === undefined);
    });

    it('should not detect a straight with wrapping past the big ace', function() {
      const cards = new Cards();

      cards.addCard('k', 's');
      cards.addCard('a', 'h');
      cards.addCard('2', 'h');
      cards.addCard('3', 'd');
      cards.addCard('4', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectStraight() === undefined);
    });

    it('should return undefined for 4 in a row', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'c');
      cards.addCard('5', 'd');
      cards.addCard('6', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectStraight() === undefined);
    });
  });

  describe('when checking for a straight flush', function() {
    it('should properly detect it', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('6', 'h');
      cards.addCard('7', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectStraightFlush().asString === 'Hearts Straight Seven');
    });

    it('should properly detect it if there is a longer straight that is not part of the flush', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('6', 'h');
      cards.addCard('7', 'h');
      cards.addCard('8', 'h');
      cards.addCard('9', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectStraightFlush().asString === 'Hearts Straight Eight');
    });

    it('should properly detect it and use the highest card for more than 5 in a row', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('6', 'h');
      cards.addCard('7', 'h');
      cards.addCard('8', 'h');
      cards.addCard('9', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectStraightFlush().asString === 'Hearts Straight Nine');
    });

    it('should rejct a regular flush', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('6', 'h');
      cards.addCard('7', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectStraightFlush().asString === 'Hearts Straight Seven');
    });

    it('should rejct a regular flush', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('6', 'h');
      cards.addCard('8', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectStraightFlush() === undefined);
    });

    it('should reject a regular straight', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('4', 'h');
      cards.addCard('5', 'h');
      cards.addCard('6', 'h');
      cards.addCard('7', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectStraightFlush() === undefined);
    });
  });

  describe('when checking for a full house', function() {
    it('should properly detect it', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('3', 's');
      cards.addCard('5', 'h');
      cards.addCard('5', 'd');
      cards.addCard('5', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectFullHouse().asString === 'Full House Fives full of Threes');
    });

    // i guess this is an invalid use case but eh
    it('should use the biggest triplet', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('3', 's');
      cards.addCard('5', 'h');
      cards.addCard('5', 'd');
      cards.addCard('5', 's');
      cards.addCard('a', 'h');
      cards.addCard('a', 'd');
      cards.addCard('a', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectFullHouse().asString === 'Full House Aces full of Threes');
    });

    it('should use the biggest doublet', function() {
      const cards = new Cards();

      cards.addCard('3', 'h');
      cards.addCard('3', 's');
      cards.addCard('5', 'h');
      cards.addCard('5', 'd');
      cards.addCard('5', 's');
      cards.addCard('a', 'h');
      cards.addCard('a', 'd');

      const hand = new Hand(cards.value);

      assert(hand.detectFullHouse().asString === 'Full House Fives full of Aces');
    });
  });

  describe('when checking for a three of a kind', function() {
    it('should properly detect it', function() {
      const cards = new Cards();

      cards.addCard('5', 'h');
      cards.addCard('5', 'd');
      cards.addCard('5', 's');
      cards.addCard('3', 's');
      cards.addCard('2', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectThreeOfAKind().asString === 'Three of a Kind Five');
      assert(hand.detectThreeOfAKind().kicker === 1);
    });

    it('should use the biggest triplet', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('a', 'd');
      cards.addCard('a', 's');
      cards.addCard('k', 'h');
      cards.addCard('k', 'd');
      cards.addCard('k', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectThreeOfAKind().asString === 'Three of a Kind Ace');
    });

    it('should not detect 3 doubles', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('a', 'd');
      cards.addCard('q', 's');
      cards.addCard('q', 'h');
      cards.addCard('k', 'd');
      cards.addCard('k', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectThreeOfAKind() === undefined);
    });
  });

  describe('when checking for a two pair', function() {
    it('should properly detect it', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('a', 'd');
      cards.addCard('q', 's');
      cards.addCard('q', 'h');
      cards.addCard('t', 'h');
      cards.addCard('3', 'h');
      cards.addCard('2', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectTwoPair().asString === 'Two pair Ace and Queen');
      assert(hand.detectTwoPair().kicker === 8);
    });

    it('should use the biggest two pairs', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('a', 'd');
      cards.addCard('q', 's');
      cards.addCard('q', 'h');
      cards.addCard('k', 'd');
      cards.addCard('k', 's');

      const hand = new Hand(cards.value);

      assert(hand.detectTwoPair().asString === 'Two pair Ace and King');
    });
  });

  describe('when checking for a pair', function() {
    it('should properly detect it', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('q', 's');
      cards.addCard('q', 'h');
      cards.addCard('t', 'h');
      cards.addCard('3', 'h');
      cards.addCard('2', 'h');

      const hand = new Hand(cards.value);

      assert(hand.detectPair().asString === 'Pair Queen');
      assert(hand.detectPair().kicker === 12);
    });
  });

  describe('when determining the quality of a hand', function() {
    it('detect the four of a kind over a full house', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('a', 'd');
      cards.addCard('a', 's');
      cards.addCard('a', 'c');
      cards.addCard('k', 'd');
      cards.addCard('k', 's');

      const hand = new Hand(cards.value);

      assert(hand.determineQualityOfHand().asString === 'Four of a Kind Ace');
    });

    it('return the high card if there is no other', function() {
      const cards = new Cards();

      cards.addCard('a', 'h');
      cards.addCard('2', 'd');
      cards.addCard('8', 's');
      cards.addCard('3', 'c');
      cards.addCard('q', 'd');
      cards.addCard('k', 's');

      const hand = new Hand(cards.value);

      const qualityOfHand = hand.determineQualityOfHand();

      assert(qualityOfHand.asString === "High Card");
      assert(qualityOfHand.value === 12);
    });
  });
});

describe('Holdem', function() {
  let holdem;

  beforeEach(function() {
    holdem = new Holdem();
  });

  describe('when receiving a new line', function() {
    describe('and the game is expecting the community cards', function() {
      beforeEach(function() {
        holdem.state = 0;
      });

      it('should throw when the line is empty', function() {
        assert.throws(() => holdem.onNewLine(''));
      });

      it('should throw when there is not 5 cards', function() {
        assert.throws(() => holdem.onNewLine('5s 5d'), /5 cards/);
        assert.throws(() => holdem.onNewLine('5s 5d 4d 3s 8c 9d'), /5 cards/);
      });

      it('should throw when there are duplicates', function() {
        assert.throws(() => holdem.onNewLine('5s 5d 5d 5d 5d'), /duplicate/);
      });

      it('should not throw when there are 5 unique cards', function() {
        holdem.onNewLine('5d 6d 7d 8d 9d');
      });
    });

    describe('and the game is expecting the players cards', function() {
      beforeEach(function() {
        holdem.state = 1;
      });

      it('should add the player when valid', function() {
        holdem.onNewLine('cole 8s 9s');

        assert(holdem.players.length === 1);
      });

      it('should throw when a card is invalid', function() {
        assert.throws(() => holdem.onNewLine('cole 88 9s'));
        assert.throws(() => holdem.onNewLine('cole 8s 99'));
      });

      it('should throw when there are too many cards', function() {
        assert.throws(() => holdem.onNewLine('cole 8s 9s ts'), /one name and 2 cards/);
      });

      it('should throw when there are not enough cards', function() {
        assert.throws(() => holdem.onNewLine('cole 8s'), /one name and 2 cards/);
      });

      it('should throw a player is added with the same cards as a previous player', function() {
        holdem.onNewLine('cole 8s 9s');
        assert.throws(() => holdem.onNewLine('cole 8s 9s'), /duplicate/);
      });
    });

    describe('when displaying the winners', function() {
      it('should put them in order', function() {
        holdem.onNewLine('5d 6d 9d as ks');
        holdem.onNewLine('michele ac kh');
        holdem.onNewLine('cole 7d 8d');
        holdem.onNewLine('sara kd kc');

        const displayStrings = holdem.getDisplayStrings();

        assert(displayStrings[0].includes('cole'));
        assert(displayStrings[1].includes('sara'));
        assert(displayStrings[2].includes('michele'));
      });

      it('should add kickers when necessary for pairs', function() {
        holdem.onNewLine('5d 6d 9d ts 2s');
        holdem.onNewLine('cole 5s 8d');
        holdem.onNewLine('sara 5h kc');

        const displayStrings = holdem.getDisplayStrings();
        holdem.displayWinners();

        assert(displayStrings[0].includes('sara'));
        assert(displayStrings[0].includes('Kicker'));
        assert(displayStrings[1].includes('cole'));
        assert(displayStrings[1].includes('Kicker'));
      });

      it('should add kickers when necessary for two pairs', function() {
        holdem.onNewLine('5d 6d 6s ts 2s');
        holdem.onNewLine('cole 5s 8d');
        holdem.onNewLine('sara 5h kc');

        const displayStrings = holdem.getDisplayStrings();
        holdem.displayWinners();

        assert(displayStrings[0].includes('sara'));
        assert(displayStrings[0].includes('Kicker'));
        assert(displayStrings[1].includes('cole'));
        assert(displayStrings[1].includes('Kicker'));
      });

      it('should output the right number in a straight up tie', function() {
        holdem.onNewLine('5d 6d 9d ts as');
        holdem.onNewLine('cole 5s 8d');
        holdem.onNewLine('sara 5h kc');

        const displayStrings = holdem.getDisplayStrings();
        holdem.displayWinners();

        assert(displayStrings[0].startsWith('1'));
        assert(displayStrings[1].startsWith('1'));
      });

      it('should know that a higher straight is worth more', function() {
        holdem.onNewLine('6d 7d 8s 9s ad');
        holdem.onNewLine('cole ts kd');
        holdem.onNewLine('sara td js');

        const displayStrings = holdem.getDisplayStrings();
        holdem.displayWinners();

        assert(displayStrings[0].includes('sara'));
        assert(displayStrings[1].includes('cole'));
      });

      it('should know that a higher straight flush is worth more', function() {
        holdem.onNewLine('6d 7d 8d 9d ad');
        holdem.onNewLine('cole 5d kd');
        holdem.onNewLine('sara td kc');

        const displayStrings = holdem.getDisplayStrings();
        holdem.displayWinners();

        assert(displayStrings[0].includes('sara'));
        assert(displayStrings[1].includes('cole'));
      });
    });
  });
});
