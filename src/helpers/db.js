import firebase from "firebase";

export const db = {
  listenPlayers: function(gameId){
    firebase.database() // sets a listener on the games.players
      .ref(`games/${gameId}/players`)
      .on('value', snapshot => {
        if(snapshot.val()){
          this.$store.commit("setPlayers", snapshot.val());
        }
    });
  },

  listenCardDeck: function(gameId){
    firebase.database()
      .ref(`games/${gameId}/cardDeck`)
      .on('value', snapshot => {
        if(snapshot.val()){
          this.$store.commit("setCardDeck", snapshot.val());
        }
    });
  }
}
