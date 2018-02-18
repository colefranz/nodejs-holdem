const readline = require('readline');

const Cards = require('./Cards.js');
const Player = require('./Player');

const ADDING_COMMUNITY_CARDS = 0;
const ADDING_PLAYERS = 1;

class Holdem {
  constructor() {
    this.reset();
  }

  reset() {
    this.communityCards = new Cards();
    this.players = [];
    this.deck = new Cards();
    this.state = 0;
  }

  play() {
    console.log('Starting game of Hold\'em');
    const holdemInterface = readline.createInterface({
      input: process.stdin,
      crlfDelay: Infinity,
    });

    holdemInterface.on('line', (line) => {
      try {
        this.onNewLine(line);
      } catch (e) {
        // the reset is probably not ideal, but that's just how life is sometimes
        this.reset();
        console.log(e.message)
        console.log('Resetting game state..');
      }
    });
  }

  onNewLine(line) {
    if (line.length > 0) {
      switch (this.state) {
        case ADDING_COMMUNITY_CARDS:
          this.setCommunity(line);
          break;
        case ADDING_PLAYERS:
          this.addPlayer(line);
          break;
      }
    } else {
      this.displayWinners();
      return;
    }
  }

  setCommunity(cardLine) {
    const cardPieces = cardLine.trim().split(' ');

    if (cardPieces.length !== 5) {
      throw new Error(`Must have only 5 cards but ${cardPieces.length} were entered`);
    }

    this.addToCards(this.communityCards, cardPieces);

    this.state++;
  }

  addPlayer(playerLine) {
    const linePieces = playerLine.trim().split(' ');

    if (linePieces.length !== 3) {
      throw new Error('Expected one name and 2 cards');
    }

    const name = linePieces.slice(0, 1)[0];
    const cardPieces = linePieces.slice(1);
    const cards = new Cards();
    this.addToCards(cards, cardPieces);

    this.players.push(new Player(name, cards, this.communityCards));
  }

  addToCards(cards, cardPieces) {
    cardPieces.forEach((cardString) => {
      if (cardString.length != 2) {
        throw new Error(`Card ${card} is invalid`);
      }

      this.deck.addCard(cardString[0], cardString[1]);
      cards.addCard(cardString[0], cardString[1]);
    });

    return cards;
  }

  orderHandsIntoHierarchy() {
    // for each player place into hierarchy of
    // quality of hand
    //   quality of hands high card
    //     quality of kicker
    return this.players.reduce(function(hierarchy, player) {
      const {quality} = player.hand;

      hierarchy[quality.ofHand] = hierarchy[quality.ofHand] || {};

      const qualityTier = hierarchy[quality.ofHand]
      qualityTier[quality.ofHighCard] = qualityTier[quality.ofHighCard] || {};

      const valueTier = qualityTier[quality.ofHighCard];
      valueTier[quality.ofKicker] = valueTier[quality.ofKicker] || [];

      valueTier[quality.ofKicker].push(player);

      return hierarchy;
    }, {});
  }

  getDisplayStrings() {
    const hierarchy = this.orderHandsIntoHierarchy();
    const displayStrings = [];

    recursivelyGetDisplayStrings(displayStrings, hierarchy, {place: 1});

    return displayStrings;
  }

  displayWinners() {
    if (this.players.length === 0) {
      throw new Error('I can\'t determine winners yet.');
    }

    this.getDisplayStrings().forEach(function(string) {
      console.log(string);
    });
  }
}

function recursivelyGetDisplayStrings(displayStrings, tier, placeHolder) {
  const keys = Object.keys(tier);
  keys.sort(sortAsInt).reverse();
  keys.forEach((key) => {
    const newTier = tier[key];

    if (newTier instanceof Array) {
      const addKicker = keys.length > 1;
      writeTierToDisplayStrings(displayStrings, newTier, placeHolder, addKicker);
    } else {
      recursivelyGetDisplayStrings(displayStrings, newTier, placeHolder);
    }
  });
}

function writeTierToDisplayStrings(displayStrings, players, placeHolder, addKicker) {
  players.forEach(function(player) {
    displayStrings.push(createDisplayString(placeHolder.place, player, addKicker));
  });

  placeHolder.place += players.length;
}

function createDisplayString(place, player, addKicker) {
  const displayStringArray = [place, player.name, player.hand.quality.asString];

  if (addKicker) {
    displayStringArray.push(`with ${Cards.getFaceStringByIndex(player.hand.quality.ofKicker)} Kicker`);
  }

  return displayStringArray.join(' ')
}

function sortAsInt(a, b) {
  return parseInt(a) - parseInt(b);
}

module.exports = Holdem;
