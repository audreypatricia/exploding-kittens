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
  }
}
