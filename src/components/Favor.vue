<template >
  <div>
    <form @submit.prevent="favorFrom">
      <label for="players">Choose a player to get a favor from:</label>
      <select v-model="selectedPlayer" name="players">
        <option v-for="player in players" :key="player.user_id" :value="player.name">
          {{ player.name }}
        </option>
      </select>
      <button>Choose</button>
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
</style>
