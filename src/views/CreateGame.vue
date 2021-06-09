<template>
  <div>
    <h1>create a new game</h1>
    <form @submit.prevent="onSubmit">
      <input :value="gameName" @input="setGameName"/>
      <button>Create game</button>
    </form>
    <WaitingRoom v-if="this.$store.state.activeGame" :gameId="this.$store.state.activeGame" :players="this.$store.state.players"  />
    <button v-if="this.$store.state.activeGame" @click="startGame">Start Game</button>
  </div>
</template>

<script>
import firebase from "firebase";
import uuid from "uuid";
import { cardDeck } from '../helpers/cardDeck'
import WaitingRoom from '../components/WaitingRoom'

export default {
  name: 'createGame',
  components: { WaitingRoom },
  data() {
    return {
      errors: []
    }
  },
  computed: {
    gameName() {
      return this.$store.state.gameName
    }
  },
  created() {
    // keep tabs on the users table
    firebase.database()
      .ref("users")
      .on('value', snapshot => {
        if(snapshot.val()){
          this.$store.commit("setAllUsers", snapshot.val());
        }
      });
  },
  methods: {
    setGameName(e) {
      this.$store.commit("setGameName", e.target.value);
    },
    onSubmit(){
      const id =uuid();
      const newGame = { creator: this.$store.state.user.user_id,
         id,
         gameName: this.$store.state.gameName,
         players: [{user_id: this.$store.state.user.user_id, name: this.$store.state.user.username, hand: [""], host: true, alive: true }],
         gameStart: false,
         cardDeck,
         discardPile: [""],
         playerTurn: null,
         moveNotification: null,
         attack: false,
      };

      firebase.database()
        .ref(`games/${id}`)
        .set(newGame);

      this.$store.commit("setActiveGame", id);
      this.$store.commit("setCardDeck", cardDeck);

      // keep tabs on the db game/players data
    firebase.database()
      .ref(`games/${id}/players`)
      .on('value', snapshot => {
        if(snapshot.val()){
          this.$store.commit("setPlayers", snapshot.val());
        }
      });

    },
    async startGame() {
      this.errors = [];
      // error checking: cannot play a game if there is only one player (the host)
      if(this.$store.state.players.length < 2){
        this.errors.push("Cannot start game with only one player");
        return;
      }

      const dbref = firebase.database().ref(`games/${this.$store.state.activeGame}/gameStart`);
      await dbref.set(true);
      this.$store.commit("setGameStart", true);

      // redirect to game route
      this.$router.push(`/game/${this.$store.state.activeGame}`);
    },
  }
}
</script>

<style lang="css" scoped>
</style>
