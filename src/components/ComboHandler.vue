<template>
  <div class="combo-pop-up">
    <p v-if="comboCancelled === false">You have chosen a combo card, select 1 or 2 more to make a combo set, press play when done.</p>
    <h4 class="combo-card-num">Combo cards selected: {{ this.cards.length }} </h4>
    <button class="cancel" @click="cancelPlay">Cancel Combo</button>
    <button class="play" @click="playCombo">Play combo!</button>

    <div class="choose-random" v-if="play === true && this.cards.length === 2 && comboCancelled === false" >
      <form @submit.prevent="takeRandom">
        <label for="players">From:</label>
        <select class="choose-player" v-model="selectedPlayer" name="players">
          <option v-for="player in alivePlayers" :key="player.user_id" :value="player.name">
            {{ player.name }}
          </option>
        </select>
        <button class="choose-button">Steal!</button>
      </form>
    </div>

    <ClickableOtherPlayer v-if="this.otherPlayerCards.length > 0 && comboCancelled === false" :playerName="selectedPlayer" :cards="otherPlayerCards" @handleSteal="handleSteal"/>

    <div v-if="play === true && this.cards.length === 3 && comboCancelled === false">
      <form @submit.prevent="trySteal">
        <label for="cardType">Choose a card type to try and steal:</label>
        <select class="choose-player" v-model="selectedCardType" name="cardType">
          <option value="defuse">defuse</option>
          <option value="nope">nope</option>
          <option value="shuffle">shuffle</option>
          <option value="favor">favor</option>
          <option value="skip">skip</option>
          <option value="future">future</option>
          <option value="attack">attack</option>
          <option value="combo1">combo1</option>
          <option value="combo2">combo2</option>
          <option value="combo3">combo3</option>
          <option value="combo4">combo4</option>
          <option value="combo5">combo5</option>
        </select>

        <br>

        <label for="players">From:</label>
        <select class="choose-player" v-model="selectedPlayer" name="players">
          <option v-for="player in alivePlayers" :key="player.user_id" :value="player.name">
            {{ player.name }}
          </option>
        </select>
        <br>
        <button class="choose-button">Try steal</button>
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
  computed: {
    alivePlayers(){
      let alivePlayers = this.players.filter(p => p.alive === true && p.name !== this.$store.state.user.username );

      return alivePlayers;
    },
    comboCancelled(){
      return this.$store.state.comboCancelled;
    }
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
        db.setMove(`${this.selectedCardType} found in ${this.selectedPlayer}'s and was stolen by ${this.$store.state.user.username}`);

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
    },
    cancelPlay(){
      // take back card from db and add it back to players hand
      let card = this.$store.state.discardPile.pop();

      db.updateDiscardPile(this.$store.state.discardPile);

      let cPlayers = this.players.slice();

      let currentPlayerIndex = cPlayers.findIndex(p => p.name === this.$store.state.user.username);

      cPlayers[currentPlayerIndex].hand.push(card[0]);

      db.updatePlayers(cPlayers);
      // set cancel data to true
      this.$store.commit("setCombo", false);
      this.$store.commit('setComboNum', 0);
      this.$emit('cleanCards');

      let moveNotification = ` ${this.$store.state.user.username} has cancelled combo move`;
      this.$emit('moveNotification', moveNotification);

    }
  }
}
</script>

<style lang="css" scoped>

div.combo-pop-up {
  position: absolute;
  left: 36%;
  top: 28%;
  border-left: 14px solid #9370DB;
  background-color: #E6E6FA;
  padding: 10px;
  width: 30em;
}

h4.combo-card-num {
  margin-top: 1%;
}

button.cancel {
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  margin-top: 2%;
  background-color: #a40d0f;
  color: white;
  border: 2px solid #a40d0f;
}

button.cancel:hover {
  background-color: white;
  color: #a40d0f;
}

button.play {
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  margin-top: 2%;
  background-color: #2E8B57;
  color: white;
  border: 2px solid #2E8B57;
  margin-left: 1%;
}

button.play:hover {
  background-color: white;
  color: #2E8B57
}

div.choose-random {
  margin-top: 2%;
}

.choose-player {
  width: 12em;
  padding: 5px;
  border-radius: 5px;
  border: none;
  margin-top: 1%;
}

button.choose-button{
  margin-left: 3%;
  font-size: 16px;
  padding: 5px;
  border: 2px solid #9370DB;
  background-color: #9370DB;
  color: white;
  border-radius: 5px;
  margin-top: 1%;
}

button.choose-button:hover {
  background-color: white;
  color: #9370DB;
}

</style>
