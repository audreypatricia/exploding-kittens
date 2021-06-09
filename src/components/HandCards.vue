<template>
<div class="deck" v-bind:class="{ alive: alive }" >
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
  props: {
    players: [],
    username: String,
    comboCards: []
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
    },
    alive(){
      let player = this.players.filter(p => p.name === this.username);
      return player[0].alive;
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

          if(this.$store.state.comboNum == 0){
            this.$store.commit("setComboNum", comboMatch[1])
          }


          // matching combo cards validation
          if(this.$store.state.comboNum != 0){
              if(comboMatch[1] != this.$store.state.comboNum){
                let moveNotification = `${this.$store.state.user.username} combo cards do not match, choose only combo${comboMatch[1]} cards`;
                this.$emit('moveNotification', moveNotification);
                return;
              }
            }
          // matching combo cards validation

          console.log("combo match found");
          this.comboCards.push(cardId);
          this.$emit('getComboCards', this.comboCards)
          gameLogic.handleMove("combo");


        } else { // if any other card
          gameLogic.handleMove(cardType, this.cardDeck, this.username, this.players);
        }
          gameLogic.discardCard(cardId, this.players, this.username);



      } else {
        console.log("not your turn");
      }

      // if(this.$store.state.combo === false){
      //   this.comboCards = [];
      // }
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
  background-color: rgba(169, 169, 169, 0.5);
}

div.alive {
  background-color:  rgba(169, 169, 169, 0);
}

div.card{
  border: 2px solid black;
  width: 13em;
  margin: 0em 1em;
}
</style>
