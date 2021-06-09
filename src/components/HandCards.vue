<template>
<div class="deck">
  <p>Your cards: </p>
  <div class="card" v-for="card in hand" :key="card.id" @click="playCard(card.cardType, card.id)">
    <h3>{{card.cardType}}</h3>
    <p>{{card.text}}</p>
  </div>
  <!-- <div v-for="test in tests" :key="test">{{ test }}</div> -->
</div>
</template>

<script>
import { gameLogic } from '../helpers/GameLogic'

export default {
  name: 'HandCards',
  data() {
    return {
      comboCards: [],
    }
  },
  props: {
    players: [],
    username: String,
  },
  computed: {
    hand(){
      let player = this.players.filter(p => p.name === this.username);
      return player[0].hand;
    },
    playerTurn(){
      return this.$store.state.playerTurn;
    },
    cardDeck(){
      return this.$store.state.cardDeck;
    }
  },
  methods: {
    playCard(cardType, cardId){
      let regex = /combo([0-9])?/;

      if(this.playerTurn === this.username){
        let moveNotification = `${this.$store.state.user.username} played a ${cardType}`;
        this.$emit('moveNotification', moveNotification);

        let comboMatch = cardType.match(regex);
        if(comboMatch){ // if selected card is a combo card
          console.log("combo match found");
          this.comboCards.push(cardId);
          this.$emit('getComboCards', this.comboCards)
          gameLogic.handleMove("combo");
          this.$store.commit("setComboNum", comboMatch[1]);
        } else { // if any other card
          gameLogic.handleMove(cardType, this.cardDeck, this.username, this.players);
        }
          gameLogic.discardCard(cardId, this.players, this.username);



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
