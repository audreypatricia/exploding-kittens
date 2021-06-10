<template >
  <div class="favor-pop-up">
    <form @submit.prevent="favorFrom">
      <label for="players">Choose a player to get a favor from:</label>
      <br>
      <select class="choose-player" v-model="selectedPlayer" name="players">
        <option v-for="player in alivePlayers" :key="player.user_id" :value="player.name">
          {{ player.name }}
        </option>
      </select>
      <button class="choose-button">Choose</button>
    </form>

  </div>

</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Favor',
  props: {
    players: Array
  },
  computed: {
    user(){
      return this.$store.state.user.username;
    },
    alivePlayers(){
      let alivePlayers = this.players.filter(p => p.alive === true && p.name !== this.$store.state.user.username);

      return alivePlayers;
    }
  },
  data() {
    return {
      selectedPlayer: '',
    }
  },
  created() {
    // firebase.database()
    //   .ref(`games/${this.$store.state.gameId}/players`)
    //   .on("value", snapshot => {
    //     if (snapshot.val()) {
    //       this.$store.commit("setPlayers", snapshot.val());
    //     }
    //   })
  },
  methods: {
    async favorFrom() {
      let copyPlayers = this.players.slice();

      let indexFavorPerson = copyPlayers.findIndex(p => p.name === this.selectedPlayer);

      let cardTaken = copyPlayers[indexFavorPerson].hand.sort(() => Math.random() - 0.5).pop();

      let indexCurrentPlayer = copyPlayers.findIndex(p => p.name === this.$store.state.user.username);

      copyPlayers[indexCurrentPlayer].hand.push(cardTaken);

      this.$store.commit('setPlayers', copyPlayers); // commit to state

      const dbref = firebase.database().ref(`games/${this.$store.state.activeGame}/players`);
      await dbref.set(copyPlayers);

      this.$store.commit("setFavor", false); // set state favor to false
    }
  }
}
</script>

<style lang="css" scoped>
div.favor-pop-up {
  position: absolute;
  left: 36%;
  top: 40%;
  border-left: 14px solid #282928;
  background-color: #D3D3D3;
  padding: 10px;
  height: 7em;
  padding: 31px;

}

.choose-player {
  width: 12em;
  padding: 5px;
  border-radius: 5px;
  border: none;
}

button.choose-button{
  margin-left: 3%;
  font-size: 16px;
  padding: 5px;
  border: 2px solid black;
  background-color: black;
  color: white;
  border-radius: 5px;
}

button.choose-player:hover {
  background-color: white;
  color: block
}

</style>
