<template>
  <div>
    <h1>Hello from join game page</h1>
    <form @submit.prevent="onSubmit">
      <input :value="gameId" @input="setGameId"/>
      <button>Join game</button>
    </form>
    <ul v-if="errors.length > 0">
      <li v-for="error in errors" :key="error">
        {{ error }}
      </li>
    </ul>
    <WaitingRoom v-if="this.$store.state.activeGame" :gameId="this.$store.state.activeGame" :players="this.$store.state.players"/>
  </div>
</template>

<script>
import firebase from "firebase";
import WaitingRoom from '../components/WaitingRoom'

export default {
  name: 'joinGame',
  components: { WaitingRoom },
  data() {
    return{
      errors: []
    }
  },
  computed: {
    gameId() {
      return this.$store.state.gameId
    },
  },

  methods: {
    setGameId(e){
      this.$store.commit("setGameId", e.target.value);
    },
    async onSubmit(){
      this.errors = [];

      const newPlayer = { user_id: this.$store.state.user.user_id, name: this.$store.state.user.username, hand:[""], host: false, alive: true };


      const dbref = firebase.database().ref(`games/${this.$store.state.gameId}/players`);
      const snapshot = await dbref.once('value');
      this.$store.commit("setPlayers", snapshot.val());

      firebase.database() // sets a listener on the games.players
        .ref(`games/${this.$store.state.gameId}/players`)
        .on('value', snapshot => {
          if(snapshot.val()){
            this.$store.commit("setPlayers", snapshot.val());
          }
      });


        // firebase.database()
        //   .ref(`games/${this.$store.state.gameId}/players`)
        //   .push(newPlayer); // pushing a new player
      if(this.$store.state.players.length < 5){
        firebase.database()
          .ref(`games/${this.$store.state.gameId}/players`)
          .set([...this.$store.state.players, newPlayer]);

        this.$store.commit("setActiveGame", this.$store.state.gameId );
      } else {
        this.errors.push("this game is full");
        this.$store.commit("setGameId", '');
      }

      firebase.database() // sets a listener on the games.gameStart
        .ref(`games/${this.$store.state.gameId}/gameStart`)
        .on('value', snapshot => {
          if(snapshot.val() === true){
            this.$store.commit("setGameStart", true);
            this.$router.push(`/game/${this.$store.state.activeGame}`);
          }
      });


    }
  },
}
</script>

<style lang="css" scoped>
</style>
