<template>
  <div>
    <div class="create-game">
      <img class="header-image" src="../assets/kaboom.jpg" alt="">
      <div class="create-input">
        <h1 v-if="this.gameNameFilled === false">create a new game</h1>
        <form v-if="this.gameNameFilled === false" @submit.prevent="onSubmit">
          <input class="gameName-input" :value="gameName" @input="setGameName" autofocus/>
          <br>
          <button class="gameName-create">Create game</button>
        </form>
        <h1 v-if="this.gameNameFilled === true">Game Room: {{ this.gameName }}</h1>
        <WaitingRoom v-if="this.$store.state.activeGame" :gameId="this.$store.state.activeGame" :players="this.$store.state.players"  />
        <button v-if="this.$store.state.activeGame" class="start-game button" @click="startGame">Start Game</button>
      </div>

    </div>

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
      errors: [],
      gameNameFilled: false,
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
      this.gameNameFilled = true;
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
         winner: '',
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

div.create-game{
  display: flex;
}

img.header-image {
  width: 15em;
  flex-basis: 0;
  flex-grow: 1;
  margin-left: 5%;
  margin-top: 5%;
}

div.create-input{
  flex-basis: 0;
  flex-grow: 2;
  margin-top: 10%;
}

input:focus{
    outline: 0;
}

button.start-game {
  font-size: 1em;
  font-weight: 600;
  margin-top: 5%;
  padding: 10px;
  background-color: white;
  /* border: 2px solid #696969; */
  color: white;
  border-radius: 5px;
}

input.gameName-input {
  font-size: 24px;
  margin-top: 3%;
}

button.gameName-create {
  font-size: 18px;
  padding: 5px;
  margin-top: 3%;
  background-color: white;
  color: #a40d0f;
  border: 2px solid #a40d0f;
  border-radius: 5px;
}

button.gameName-create:hover {
  color: white;
  font-weight: 600;
  background-color: #a40d0f;
}

.button {
  background-color: #004A7F;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: Arial;
  font-size: 20px;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  -webkit-animation: glowing 1500ms infinite;
  -moz-animation: glowing 1500ms infinite;
  -o-animation: glowing 1500ms infinite;
  animation: glowing 1500ms infinite;
}
@-webkit-keyframes glowing {
  0% { background-color: #5c5c5e; -webkit-box-shadow: 0 0 3px #5c5c5e; }
  50% { background-color: #a40d0f; -webkit-box-shadow: 0 0 40px #a40d0f; }
  100% { background-color: #5c5c5e; -webkit-box-shadow: 0 0 3px #5c5c5e; }
}

@-moz-keyframes glowing {
  0% { background-color: #5c5c5e; -moz-box-shadow: 0 0 3px #5c5c5e; }
  50% { background-color: #a40d0f; -moz-box-shadow: 0 0 40px #a40d0f; }
  100% { background-color: #5c5c5e; -moz-box-shadow: 0 0 3px #5c5c5e; }
}

@-o-keyframes glowing {
  0% { background-color: #5c5c5e; box-shadow: 0 0 3px #5c5c5e; }
  50% { background-color: #a40d0f; box-shadow: 0 0 40px #a40d0f; }
  100% { background-color: #5c5c5e; box-shadow: 0 0 3px #5c5c5e; }
}

@keyframes glowing {
  0% { background-color: #5c5c5e; box-shadow: 0 0 3px #5c5c5e; }
  50% { background-color: #a40d0f; box-shadow: 0 0 40px #a40d0f; }
  100% { background-color: #5c5c5e; box-shadow: 0 0 3px #5c5c5e; }
}
</style>
