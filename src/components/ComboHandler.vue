<template>
  <div>
    <p>You have chosen a combo card, select 1 or 2 more to make a combo set, press play when done.</p>
    <p>Combo cards selected: {{ this.cards.length }} </p>
    <button @click="playCombo">Play combo!</button>

    <div v-if="play === true && this.cards.length === 2">
      <form @submit.prevent="takeRandom">
        <label for="players">From:</label>
        <select v-model="selectedPlayer" name="players">
          <option v-for="player in players" :key="player.user_id" :value="player.name">
            {{ player.name }}
          </option>
        </select>
        <button>Steal!</button>
      </form>
    </div>

    <ClickableOtherPlayer v-if="this.otherPlayerCards.length > 0" :playerName="selectedPlayer" :cards="otherPlayerCards" @handleSteal="handleSteal"/>

    <div v-if="play === true && this.cards.length === 3">
      <form @submit.prevent="trySteal">
        <label for="cardType">Choose a card type to try and steal:</label>
        <select v-model="selectedCardType" name="cardType">
          <option value="defuse">defuse</option>
          <option value="nope">nope</option>
          <option value="shuffle">shuffle</option>
          <option value="favor">favor</option>
          <option value="skip">skip</option>
          <option value="future">future</option>
          <option value="attack">attack</option>
        </select>

        <label for="players">From:</label>
        <select v-model="selectedPlayer" name="players">
          <option v-for="player in players" :key="player.user_id" :value="player.name">
            {{ player.name }}
          </option>
        </select>

        <button>Try steal</button>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from "../helpers/db";
import ClickableOtherPlayer from "./ClickableOtherPlayer";

export default {
  name: 'ComboHandler',
  components: { ClickableOtherPlayer },
  data() {
    return {
      play: false,
      selectedCardType: null,
      selectedPlayer: null,
      otherPlayerCards: [],
    }
  },
  props: {
    cards: [],
    players: [],
  },
  methods: {
    playCombo(){
      this.play = true;
    },
    takeRandom() {
      let unluckyPlayer = this.players.findIndex(p => p.name === this.selectedPlayer);

      this.otherPlayerCards = this.players[unluckyPlayer].hand.slice();
    },
    handleSteal(cardId) {
      let unluckyPlayer = this.players.findIndex(p => p.name === this.selectedPlayer);
      let cardIndex = this.players[unluckyPlayer].hand.findIndex(c => c.id === cardId);

      let cPlayers = this.$store.state.players.slice();
      let currentPlayerIndex = cPlayers.findIndex(p => p.name === this.$store.state.user.username);
      cPlayers[currentPlayerIndex].hand.push(cPlayers[unluckyPlayer].hand[cardIndex]);
      //remove card from unlucky human
      cPlayers[unluckyPlayer].hand = cPlayers[unluckyPlayer].hand.filter((c, i) => i !== cardIndex);


      db.updatePlayers(cPlayers);

      // making the select components dissapear
      this.play = false;
      this.otherPlayerCards = [];
      // this.cards = [];
      this.selectedCardType = null;
      this.selectedPlayer = null;
      this.$store.commit('setCombo', false);
      this.$store.commit('setComboNum', 0);

      this.$emit('cleanCards');
    },
    trySteal() {
      let unluckyPlayer = this.players.findIndex(p => p.name === this.selectedPlayer);
      let cardIndex = this.players[unluckyPlayer].hand.findIndex(c => c.cardType === this.selectedCardType);

      if(cardIndex === -1 ){ // card not found
        db.setMove(`${this.selectedCardType} could not be found in ${this.selectedPlayer}'s hand'`);
      } else { // card was found and stolen!
        let cPlayers = this.$store.state.players.slice();
        let currentPlayerIndex = cPlayers.findIndex(p => p.name === this.$store.state.user.username);

        cPlayers[currentPlayerIndex].hand.push(cPlayers[unluckyPlayer].hand[cardIndex]); // add found card to player

        //remove found card from unlucky human
        cPlayers[unluckyPlayer].hand = cPlayers[unluckyPlayer].hand.filter((c, i) => i !== cardIndex);

        console.log(cPlayers);

        // update players on db
        db.updatePlayers(cPlayers);
      }

      // making the select components dissapear
      this.play = false;
      this.otherPlayerCards = [];
      // this.cards = [];
      this.selectedCardType = null;
      this.selectedPlayer = null;
      this.$store.commit("setCombo", false);
      this.$store.commit('setComboNum', 0);

      this.$emit('cleanCards');
    }
  }
}
</script>

<style lang="css" scoped>
</style>
