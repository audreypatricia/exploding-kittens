<template>
  <div>
    <p>It is {{ this.$store.state.playerTurn }}'s turn</p>
    <OtherPlayerHand v-for="player in otherPlayers" :key="player.user_id" :player="player"/>

    <CardDeck @moveNotification="moveNotification"/>

    <DiscardPile v-if="this.discardPileReady === true" :cardType="this.discardCardType" :cardText="this.discardCardText" :key="this.discardCardId"/>

    <p>{{ move }}</p>

    <Favor v-if="this.$store.state.favor === true" :players="this.players"/>

    <SeeTheFuture v-if="this.$store.state.seeFuture === true" :cards="this.futureCards" />

    <ComboHandler v-if="this.$store.state.combo === true" :players="this.$store.state.players" :cards="comboCards" @cleanCards="cleanCards" @moveNotification="moveNotification" />

    <HandCards v-if="this.$store.state.players" :players="this.$store.state.players" :username="this.$store.state.user.username" @moveNotification="moveNotification"
    @getComboCards="getComboCards" :comboCards="comboCards"/>

    <Winner v-if="this.$store.state.winner !== '' " :winner="this.$store.state.winner"/>
  </div>
</template>

<script>
import firebase from "firebase";
import { bg } from "../helpers/dealCards";
import { db } from "../helpers/db";
import HandCards from "../components/HandCards";
import OtherPlayerHand from "../components/OtherPlayerHand";
import Favor from "../components/Favor";
import CardDeck from "../components/CardDeck";
import SeeTheFuture from "../components/SeeTheFuture";
import ComboHandler from "../components/ComboHandler";
import Winner from "../components/Winner";
import DiscardPile from "../components/DiscardPile";

export default {
  name: 'GamePlay',
  components: { HandCards, OtherPlayerHand, Favor, CardDeck, SeeTheFuture, ComboHandler, Winner, DiscardPile },
  data() {
    return {
      move: null,
      comboCards: [],
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
    },
    future(){
      return this.$store.state.seeFuture;
    },
    futureCards(){
      let future = [];
      let copyDeck = this.cardDeck.slice();
      for(let i = 0; i < 3; i++){
        future.push(copyDeck.shift());
      }
      return future;
    },
    discardPileReady(){
      if(this.$store.state.discardPile.length > 1){
        return true;
      }else {
        return false;
      }
    },
    discardCardType(){
      return this.$store.state.discardPile[this.$store.state.discardPile.length - 1][0].cardType;
    },
    discardCardText(){
      return this.$store.state.discardPile[this.$store.state.discardPile.length - 1][0].text;
    },
    discardCardId(){
      return this.$store.state.discardPile[this.$store.state.discardPile.length - 1][0].id;
    }
  },
  async created() {
    console.log("created");
    // db listener setups
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

        firebase.database()
          .ref(`games/${this.$store.state.activeGame}/cardDeck`)
          .on('value', snapshot => {
            if(snapshot.val()){
              this.$store.commit("setCardDeck", snapshot.val());
            }
        });

        firebase.database()
          .ref(`games/${this.$store.state.activeGame}/discardPile`)
          .on('value', snapshot => {
            if(snapshot.val()){
              this.$store.commit("setDiscardPile", snapshot.val());
            }
        });

        db.listenToAttack(this.$store.state.activeGame);

        db.gameStartListener(this.$store.state.activeGame);

        db.winnerListener(this.$store.state.activeGame)


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
    }
  },
  methods: {
    moveNotification(move){
      this.move = move;

      firebase.database()
        .ref(`games/${this.$store.state.activeGame}/moveNotification`)
        .set(this.move);
    },
    getComboCards(comboCards){
      this.comboCards = comboCards
    },
    cleanCards(){
      this.comboCards = [];
      this.$store.commit('setCombo', false);
    }
  }

}
</script>

<style lang="css" scoped>
</style>
