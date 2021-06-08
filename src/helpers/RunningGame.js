import store from '../store'
import firebase from 'firebase'

export const gr = {
  drawCard: function(playerName, players, cardDeck) {
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
      let defusePresent = players[currentPlayerIndex].hand.find(c => c.cardType === 'defuse');

      if(defusePresent){
      //TODO HANDLE SHUFFLE DECK NEXT TURN
        let playerCards = players[currentPlayerIndex].hand;

        let defuseIndex = playerCards.map(function(c) { return c.cardType; }).indexOf('defuse');

        playerCards = playerCards.slice(0, defuseIndex).concat(playerCards.slice(defuseIndex + 1));

        players[currentPlayerIndex].hand = playerCards;

        //shuffle deck and save to db
        cardDeck = cardDeck.sort(() => Math.random() - 0.5);

        firebase.database()
          .ref(`games/${store.state.activeGame}/cardDeck`)
          .set(cardDeck);

        return this.findNextPlayer(playerName, players);


      } else{
      // TODO - handle user dying
      }
    }


  },
  findNextPlayer: function(currentPlayer, players){

    console.log("finding next player");
    let currentPlayerIndex = players.map(function(p) { return p.name; }).indexOf(currentPlayer);
    if(currentPlayerIndex + 1 > players.length -1 ){
      console.log(players[0].name)
      return players[0].name;
    } else {
      console.log(players[currentPlayerIndex + 1].name);
      return players[currentPlayerIndex + 1].name;
    }

  }
}
