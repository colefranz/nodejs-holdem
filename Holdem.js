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
    const players = this.players.map((player) => {
      return {
        name: player.name,
        hand: player.getQualityOfHand(this.communityCards.value)
      };
    });

    return players.reduce(function(hierarchy, playerStuff) {
      const {quality, value, kicker} = playerStuff.hand;

      if (!hierarchy[quality]) {
        hierarchy[quality] = {};
      }

      const qualityTier = hierarchy[quality]

      if (!qualityTier[value]) {
        qualityTier[value] = {};
      }

      const valueTier = qualityTier[value];

      if (!valueTier[kicker]) {
        valueTier[kicker] = [];
      }

      valueTier[kicker].push(playerStuff);

      return hierarchy;
    }, {});
  }

  getDisplayStrings() {
    const hierarchy = this.orderHandsIntoHierarchy();
    const displayStrings = [];

    let place = 1;

    const qualityKeys = Object.keys(hierarchy);
    qualityKeys.sort(sortAsInt).reverse();
    qualityKeys.forEach((quality) => {
      const qualityTier = hierarchy[quality];
      const valueKeys = Object.keys(qualityTier);
      valueKeys.sort(sortAsInt).reverse();

      valueKeys.forEach((value) => {
        const valueTier = qualityTier[value];
        const kickerKeys = Object.keys(valueTier);
        kickerKeys.sort(sortAsInt).reverse();
        const addKicker = kickerKeys.length > 1;

        kickerKeys.forEach((kicker) => {
          const kickerTier = valueTier[kicker];
          kickerTier.forEach(function(player) {
            displayStrings.push(createDisplayString(place, player, addKicker));
          });
          place += kickerTier.length;
        });
      });
    });

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

function createDisplayString(place, player, addKicker) {
  const displayStringArray = [place, player.name, player.hand.asString];

  if (addKicker) {
    displayStringArray.push(`with ${Cards.getFaceStringByIndex(player.hand.kicker)} Kicker`);
  }

  return displayStringArray.join(' ')
}

function sortAsInt(a, b) {
  return parseInt(a) - parseInt(b);
}

module.exports = Holdem;
