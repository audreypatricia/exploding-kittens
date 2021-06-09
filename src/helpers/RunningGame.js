import store from '../store'
import firebase from 'firebase'
import { db } from './db';

export const gr = {
  drawCard: async function(playerName, players, cardDeck) {

    let currentPlayerIndex = players.map(function(p) { return p.name; }).indexOf(playerName);
    let newCard = cardDeck.shift();

    if(newCard.cardType !== 'explode'){
      players[currentPlayerIndex].hand.push(newCard);
      // add cards to hand db
      // update firebase cardDeck
      firebase.database()
        .ref(`games/${store.state.activeGame}/cardDeck`)
        .set(cardDeck);
      firebase.database()
        .ref(`games/${store.state.activeGame}/players`)
        .set(players);
      // move on to nextPlayer turn

      return gr.findNextPlayer(playerName, players);

    } else {
      // draws an exploding kitten card
      let moveNotification = `${store.state.user.username} drawed an exploding kitten!`;

      db.setMove(moveNotification);

      let defusePresent = players[currentPlayerIndex].hand.find(c => c.cardType === 'defuse');

      if(defusePresent){
      //TODO HANDLE SHUFFLE DECK NEXT TURN
        setTimeout(function(){
          let moveNotification = `Luckily ${store.state.user.username} has a defuse`;
          db.setMove(moveNotification);
        }, 2000);

        let playerCards = players[currentPlayerIndex].hand;

        let defuseIndex = playerCards.map(function(c) { return c.cardType; }).indexOf('defuse');

        playerCards = playerCards.filter((c,i) => i != defuseIndex );

        players[currentPlayerIndex].hand = playerCards;

        //shuffle deck and save to db
        cardDeck = cardDeck.sort(() => Math.random() - 0.5);

        // firebase.database()
        //   .ref(`games/${store.state.activeGame}/cardDeck`)
        //   .set(cardDeck);

        const dbref = firebase.database().ref(`games/${store.state.activeGame}/cardDeck`);
        await dbref.set(cardDeck);

        return this.findNextPlayer(playerName, players);


      } else{
      // TODO - handle user dying
        console.log("here");
        players[currentPlayerIndex].alive = false;
        db.updatePlayers(players);

        setTimeout(function(){
          let moveNotification = ` ${store.state.user.username} is now dead`;
          db.setMove(moveNotification);
        }, 2000);

        // check how many people are still alive
        let alivePlayers = players.filter(p => p.alive === true);
        debugger; // eslint-disable-line no-debugger
        if(alivePlayers.length === 1){
          const dbref = firebase.database().ref(`games/${store.state.activeGame}/winner`);
          await dbref.set(alivePlayers[0].name);

          const dbref2 = firebase.database().ref(`games/${store.state.activeGame}/gameStart`);
          await dbref2.set(false);

          return 0;
        }

        cardDeck = cardDeck.sort(() => Math.random() - 0.5);

        firebase.database()
          .ref(`games/${store.state.activeGame}/cardDeck`)
          .set(cardDeck);

        return this.findNextPlayer(playerName, players);

      }
    }


  },
  findNextPlayer: function(currentPlayer, players){
    let alive = false;
    let nextPlayerIndex = -1;
    let currentPlayerIndex = players.map(function(p) { return p.name; }).indexOf(currentPlayer);
    if(currentPlayerIndex + 1 > players.length -1 ){
      // return players[0].name;
      nextPlayerIndex = 0;
    } else {
       // return players[currentPlayerIndex + 1].name;
       nextPlayerIndex = currentPlayerIndex + 1;
    }

    while(alive === false){
      alive = this.checkAlive(nextPlayerIndex, players);

      if(alive === true){
        break;
      }
      nextPlayerIndex += 1;
    }

    return players[nextPlayerIndex].name;

  },
  checkAlive: function(playerIndex, players) {
    if(players[playerIndex].alive === true){
      return true;
    }else {
      return false;
    }
  }
}
