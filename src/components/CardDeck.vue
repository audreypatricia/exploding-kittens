<template>
  <div class="deck" @click="endTurn">
    <p>Card Deck</p>
  </div>
</template>

<script>
import { gr } from '../helpers/RunningGame'
import firebase from "firebase";

export default {
  name: "CardDeck",
  computed: {
    name() {
      return this.$store.state.user.username;
    },
    players() {
      return this.$store.state.players;
    },
    cardDeck() {
      return this.$store.state.cardDeck;
    },

  },
  methods: {
    endTurn(){
      if(this.$store.state.attack === true){ // if person is being attacked
        // draw a card
        gr.drawCard(this.name, this.players, this.cardDeck)
        this.$store.commit('setAttack', false);
      }else {
        console.log("last round to play before swap players")
        let playerTurn = gr.drawCard(this.name, this.players, this.cardDeck);

        this.$store.commit('setPlayerTurn', playerTurn);

        firebase.database()
          .ref(`games/${this.$store.state.activeGame}/playerTurn`)
          .set(playerTurn);

      }  

    }
  }
}
</script>

<style lang="css" scoped>
div.deck {
  border: 2px solid black;
  height: 5em;
  width: 5em;
}
</style>
