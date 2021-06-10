import { gr } from './RunningGame';
import store from '../store';
import firebase from 'firebase';
import { db } from './db';

const cardTypeHeaders = {
  0: 'explode',
  1: 'defuse',
  2: 'favor',
  3: 'skip',
  4: 'attack',
  5: 'future',
  6: 'nope',
  7: 'shuffle',
  8: 'combo',
}

export const gameLogic = {
  handleMove: function(cardType, cardDeck = null, currentPlayer = null, players = null){
    let values = Object.values(cardTypeHeaders);
    let index = values.indexOf(cardType);

    switch (index) {
      case 0:
        // explode action - its own function when card is pulled out
        break;
      case 1:
        break;
      case 2:
        // favor action
        store.commit("setFavor", true);

        break;
      case 3:
        // skip action
        //currentplayer = playername
        let nextPlayer = gr.findNextPlayer(currentPlayer, players) //eslint-disable-line no-case-declarations
        db.updatePlayerTurn(nextPlayer);
        break;
      case 4:
        //attack action
        nextPlayer = gr.findNextPlayer(currentPlayer, players);
        db.updatePlayerTurn(nextPlayer);
        firebase.database()
          .ref(`games/${store.state.activeGame}/attack`)
          .set(true);
        break;
      case 5:
        // future action
        store.commit('setFuture', true);
        return;
      case 6:
        break;
      case 7:
      // shuffle action
        firebase.database()
          .ref(`games/${store.state.activeGame}/cardDeck`)
          .set(cardDeck.sort(() => Math.random() - 0.5));
        break;
      case 8:
        store.commit("setCombo", true);
        break;
    }
  },
  discardCard: function(cardId, players, playerName){
    let currentPlayerIndex = players.indexOf(players.find(p => p.name === playerName));
    let playerCards = players[currentPlayerIndex].hand;
    let playedCardObj = playerCards.filter(c => c.id === cardId);
    let playedCardIndex = playerCards.findIndex(c => c.id === cardId);

    players[currentPlayerIndex].hand = playerCards.slice(0, playedCardIndex).concat(playerCards.slice(playedCardIndex + 1));

    // add playedCard to discard pile
    firebase.database()
      .ref(`games/${store.state.activeGame}/discardPile`)
      .set([...store.state.discardPile, playedCardObj]);

    // set new player hands
    firebase.database()
      .ref(`games/${store.state.activeGame}/players`)
      .set(players);

  },
  findCard: function(card, cardId){
    return card.id === cardId;
  },
  returnCard: function(discardPile, playerName, players){
    let cPlayers = players.slice();
    let currentPlayer = cPlayers.filter(p => p.name === playerName);
    let card = discardPile[discardPile.length - 1];

    currentPlayer.hand.push(card);

    firebase.database()
      .ref(`games/${store.state.activeGame}/players`)
      .set(players);
  }
}
