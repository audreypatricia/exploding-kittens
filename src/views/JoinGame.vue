<template>
  <div class="join-room">
    <img class="header-image shadow" src="../assets/playCat.png" alt="">

    <div class="join-input">

      <form v-if="this.gameIdFilled === false" @submit.prevent="onSubmit">
        <h1>Enter Game Pin:</h1>
        <input class="gameName-id" :value="gameId" @input="setGameId" placeholder="Game Pin here"/>
        <br>
        <button class="gameName-join">Join game</button>
      </form>
      <h1 class="gameName" v-if="this.gameIdFilled === true">Game Room: {{ this.gameName }}</h1>
      <ul v-if="errors.length > 0">
        <li v-for="error in errors" :key="error">
          {{ error }}
        </li>
      </ul>
      <WaitingRoom v-if="this.$store.state.activeGame" :gameId="this.$store.state.activeGame" :players="this.$store.state.players"/>
    </div>

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
      errors: [],
      gameIdFilled: false,
    }
  },
  computed: {
    gameId() {
      return this.$store.state.gameId
    },
    gameName() {
      return this.$store.state.gameName;
    }
  },

  methods: {
    setGameId(e){
      this.$store.commit("setGameId", e.target.value);
    },
    async onSubmit(){
      this.errors = [];
      this.gameIdFilled = true;

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

        firebase.database()
          .ref(`games/${this.$store.state.gameId}/gameName`)
          .on("value", snapshot => {
            if (snapshot.val()) {
              this.$store.commit("setGameName",
              snapshot.val());
            }
          })

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

div.join-room {
  display: flex;
}

img.header-image {
  width: 15em;
  flex-basis: 0;
  flex-grow: 1;
  margin-left: 5%;
  margin-top: 5%;
  border-radius: 5px;
}

div.join-input {
  flex-basis: 0;
  flex-grow: 2;
  margin-top: 10%;
}

input.gameName-id {
  font-size: 24px;
  margin-top: 3%;
}

button.gameName-join{
  font-size: 18px;
  padding: 5px;
  margin-top: 3%;
  background-color: white;
  color: #a40d0f;
  border: 2px solid #a40d0f;
  border-radius: 5px;
}

.gameName {
  margin-top: 3%;
}

.shadow {
  -webkit-box-shadow: 3px 3px 5px 6px #ccc;
  -moz-box-shadow: 3px 3px 5px 6px #ccc;
  box-shadow: 3px 3px 5px 6px #ccc;
}
</style>
