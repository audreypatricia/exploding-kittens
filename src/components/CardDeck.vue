<template>
  <div @click="endTurn">

    <div class="deck">
      <h4>Card Deck</h4>
      <img class="logo" src="../assets/explodingCatLogo.png" alt="">
    </div>

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
    async endTurn(){
      if(this.$store.state.attack === true){ // if person is being attacked
        // draw a card
        gr.drawCard(this.name, this.players, this.cardDeck)
        this.$store.commit('setAttack', false);

        let moveNotification = ` ${this.$store.state.user.username} needs to draw one more card to end their turn`;
        this.$emit('moveNotification', moveNotification);
      }else {

        let playerTurn = await gr.drawCard(this.name, this.players, this.cardDeck);

        this.$store.commit('setPlayerTurn', playerTurn);

        firebase.database()
          .ref(`games/${this.$store.state.activeGame}/playerTurn`)
          .set(playerTurn);

        let moveNotification = ` ${this.$store.state.user.username} has ended their turn`;
        this.$emit('moveNotification', moveNotification);

      }

    }
  }
}
</script>

<style lang="css" scoped>
div.deck {
  border: 2px solid black;
  width: 10em;
  height: 12em;
  position: absolute;
  left: 5%;
  bottom: 45%;
  background-color: rgba(192,192,192, 0.7);
  box-shadow: 5px 10px 8px #888888;
  border-radius: 5px;
}

img.logo {
  width: 5em;
  height: 5em;
  margin-top: 24%;
}

</style>
