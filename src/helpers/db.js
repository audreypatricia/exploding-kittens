import firebase from "firebase";
import store from '../store';

export const db = {
  listenPlayers: function(gameId){
    firebase.database() // sets a listener on the games.players
      .ref(`games/${gameId}/players`)
      .on('value', snapshot => {
        if(snapshot.val()){
          store.commit("setPlayers", snapshot.val());
        }
    });
  },

  listenCardDeck: function(gameId){
    firebase.database()
      .ref(`games/${gameId}/cardDeck`)
      .on('value', snapshot => {
        if(snapshot.val()){
          store.commit("setCardDeck", snapshot.val());
        }
    });
  },

  updatePlayerTurn: function(nextPlayer) {
    firebase.database()
      .ref(`games/${store.state.activeGame}/playerTurn`)
      .set(nextPlayer);
  },
  listenToAttack: function(gameId){
    firebase.database()
      .ref(`games/${gameId}/attack`)
      .on('value', snapshot => {
        if(snapshot.val()){
          console.log("running listener on attack")
          store.commit("setAttack", snapshot.val());
        }
    });
  },
  setMove: function(move){
    firebase.database()
      .ref(`games/${store.state.activeGame}/moveNotification`)
      .set(move);
  },
  updatePlayers: function(players) {
    firebase.database()
      .ref(`games/${store.state.activeGame}/players`)
      .set(players);
  }

}
