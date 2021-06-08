<template>
  <div>
    <p>It is {{ this.$store.state.playerTurn }}'s turn</p>
    <OtherPlayerHand v-for="player in otherPlayers" :key="player.user_id" :player="player"/>

    <CardDeck />

    <p>{{ move }}</p>
    <Favor v-if="this.favor === true" :players="this.players"/>

    <HandCards v-if="this.$store.state.players" :players="this.$store.state.players" :username="this.$store.state.user.username" @moveNotification="moveNotification"/>
  </div>
</template>

<script>
import firebase from "firebase";
import { bg } from "../helpers/dealCards";
import { db } from "../helpers/db";
import HandCards from "../components/HandCards";
import OtherPlayerHand from "../components/OtherPlayerHand";
import Favor from "../components/Favor"
import CardDeck from "../components/CardDeck"

export default {
  name: 'GamePlay',
  components: { HandCards, OtherPlayerHand, Favor, CardDeck },
  data() {
    return {
      move: null
    }
  },
  computed: {
    numOfPlayers() {
      return this.$store.state.players.length
    },
    players() {
      return this.$store.state.players
    },
    cardDeck() {
      return this.$store.state.cardDeck
    },
    otherPlayers() {
      let others = this.players.filter( p => p.name !== this.$store.state.user.username);
      return others;
    },
    favor(){
      return this.$store.state.favor;
    }
  },
  async created() {

    firebase.database()
      .ref(`games/${this.$store.state.activeGame}/playerTurn`)
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.$store.commit("setPlayerTurn", snapshot.val());
        }
      })

      firebase.database()
        .ref(`games/${this.$store.state.activeGame}/moveNotification`)
        .on("value", snapshot => {
          if (snapshot.val()) {
            this.move = snapshot.val();
          }
        })

    const userObject = this.$store.state.players.find(u => u.name === this.$store.state.user.username);

    if(userObject.host === true){ //host deals the cards
      let copyDeck = this.cardDeck.slice();

      // remove extra exploding kittens
      copyDeck = bg.removeExplode(copyDeck, this.numOfPlayers);

      // removing extra defuses
      copyDeck = bg.removeDefuse(copyDeck, this.numOfPlayers);

      // distribute one defuse card to each player
      let result = bg.distributeDefuse(copyDeck, this.players);
      this.$store.commit("setPlayers", result[0]);
      copyDeck = result[1];

      //shuffle deck
      copyDeck = bg.shuffleCards(copyDeck);

      //shuffle cards
      copyDeck.sort(() => Math.random() - 0.5);

      // deal each player 4 more cards
      let readyGame = bg.dealCards(copyDeck, this.players);
      this.$store.commit("setPlayers", readyGame[0]);
      // this.players = readyGame[0];
      copyDeck = readyGame[1];

      // this.$store.commit('setPlayers', this.players);

      const dbref = firebase.database().ref(`games/${this.$store.state.activeGame}/cardDeck`);
      await dbref.set(copyDeck);
      this.$store.commit("setCardDeck", copyDeck);

      firebase.database()
        .ref(`games/${this.$store.state.activeGame}/players`)
        .set(this.players);

      // set players Turn to the host
      this.$store.commit("setPlayerTurn", this.$store.state.user.username);
      firebase.database()
        .ref(`games/${this.$store.state.activeGame}/playerTurn`)
        .set(this.$store.state.playerTurn);

    } else {

      db.listenPlayers(this.$store.state.activeGame);

      firebase.database()
        .ref(`games/${this.$store.state.activeGame}/cardDeck`)
        .on('value', snapshot => {
          if(snapshot.val()){
            this.$store.commit("setCardDeck", snapshot.val());
          }
      });
    }

  },
  methods: {
    moveNotification(move){
      this.move = move;

      firebase.database()
        .ref(`games/${this.$store.state.activeGame}/moveNotification`)
        .set(this.move);
    },
  }

}
</script>

<style lang="css" scoped>
</style>
