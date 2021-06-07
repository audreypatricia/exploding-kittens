<template>
<div class="deck">
  <p>Your cards: </p>
  <div class="card" v-for="card in hand" :key="card.id" @click="nextPlayer(card.cardType)">
    <h3>{{card.cardType}}</h3>
    <p>{{card.text}}</p>
  </div>
  <!-- <div v-for="test in tests" :key="test">{{ test }}</div> -->
</div>
</template>

<script>
import { gr } from '../helpers/RunningGame'
import firebase from "firebase";

export default {
  name: 'HandCards',
  props: {
    players: [],
    username: String,
  },
  computed: {
    hand(){
      let player = this.players.filter(p => p.name === this.username);
      return player[0].hand;
    }
  },
  methods: {
    nextPlayer(cardType){
      let moveNotification = `${this.$store.state.user.username} played a ${cardType}`;
      this.$emit('moveNotification', moveNotification);
      if(this.$store.state.user.username === this.$store.state.playerTurn){
          let nextPlayer = gr.findNextPlayer(this.$store.state.playerTurn, this.$store.state.players);
          this.$store.commit('setPlayerTurn', nextPlayer);

          firebase.database()
            .ref(`games/${this.$store.state.activeGame}/playerTurn`)
            .set(nextPlayer);


      } else {
        console.log("not your turn");
      }

    }
  }
}
</script>

<style lang="css" scoped>
div.deck {
  display: flex;
  justify-content: center;
  border: 2px dashed black;
  padding: 2em;
}
div.card{
  border: 2px solid black;
  width: 13em;
  margin: 0em 1em;
}
</style>
