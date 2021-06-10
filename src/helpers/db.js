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
  },
  setWinner: function(winner){
    firebase.database()
      .ref(`games/${store.state.activeGame}/winner`)
      .set(winner);
  },
  winnerListener: function(gameId) {
    console.log("winner listener called");
    firebase.database()
      .ref(`games/${gameId}/winner`)
      .on('value', snapshot => {
        if(snapshot.val()){
          store.commit("setWinner", snapshot.val());
        }
    });
  },
  updateGameStart: function(gameStart) {
    firebase.database()
      .ref(`games/${store.state.activeGame}/gameStart`)
      .set(gameStart);
  },
  gameStartListener: function(gameId){
    console.log("listening for gameStart");
    firebase.database()
      .ref(`games/${gameId}/gameStart`)
      .on('value', snapshot => {
        if(snapshot.val()){
          store.commit("setGameStart", snapshot.val());
        }
    });
  },
  setNopeableTrue: function(){
    firebase.database()
      .ref(`games/${store.state.activeGame}/nopeable`)
      .set("true");
  },
  setNopeableFalse: function(){
    firebase.database()
      .ref(`games/${store.state.activeGame}/nopeable`)
      .set("false");
  },
  setNopeablePlayed: function(){
    firebase.database()
      .ref(`games/${store.state.activeGame}/nopeable`)
      .set("played");
  },
  NopeableListener: function(gameId){
    firebase.database()
      .ref(`games/${gameId}/nopeable`)
      .on('value', snapshot => {
        if(snapshot.val()){
          store.commit("setNopeable", snapshot.val());
        }
    });
  },
  updateDiscardPile: function(discardPile){
    firebase.database()
      .ref(`games/${store.state.activeGame}/discardPile`)
      .set(discardPile);
  },
  updateExplosion: function(explosion){
    firebase.database()
      .ref(`games/${store.state.activeGame}/explosion`)
      .set(explosion);
  },
  explosionListener: function(gameId){
    firebase.database()
      .ref(`games/${gameId}/explosion`)
      .on('value', snapshot => {
        if(snapshot.val()){
          store.commit("setExplosion", snapshot.val());
        }
    });
  }

}
