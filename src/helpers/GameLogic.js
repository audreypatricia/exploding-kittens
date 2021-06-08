import { gr } from './RunningGame';
import store from '../store'

const cardTypeHeaders = {
  0: 'explode',
  1: 'defuse',
  2: 'favor',
  3: 'skip',
  4: 'attack',
  5: 'future',
  6: 'nope',
  7: 'shuffle',
  8: 'combo1',
  9: 'combo2',
  10: 'combo3',
  11: 'combo4',
  12: 'combo5'
}

export const gameLogic = {
  handleMove: function(cardType, cardDeck = null, currentPlayer = null, players){
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
        gr.findNextPlayer(currentPlayer, players)
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
      // shuffle action
        cardDeck.sort(() => Math.random() - 0.5);
        return cardDeck;
      case 8:
        break;
      case 9:
        break;
      case 10:
        break;
      case 11:
        break;
      case 12:
        break;
    }
  }
}
