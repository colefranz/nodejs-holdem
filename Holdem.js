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
        this.reset();
        console.log(e);
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

  determinePlayersOrder() {
    const players = this.players.map((player) => {
      return {
        name: player.name,
        hand: player.getQualityOfHand(this.communityCards.value)
      };
    });

    players.sort(function(playera, playerb) {
      let comparatora = playera.hand.quality;
      let comparatorb = playerb.hand.quality;

      if (playera.hand.quality === playerb.hand.quality) {
        return playerb.hand.value - playera.hand.value;
      }

      return comparatora - comparatorb;
    });

    return players;
  }

  displayWinners() {
    if (this.players.length === 0) {
      throw new Error('I can\'t determine winners yet.');
    }

    const playersInOrder = this.determinePlayersOrder();

    playersInOrder.forEach(function({name, hand}, index) {
      console.log([index + 1, name, hand.asString].join(' '));
    });
  }
}

module.exports = Holdem;
