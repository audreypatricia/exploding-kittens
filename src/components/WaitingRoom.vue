<template>
  <div class="waiting-room">
    <h2>Game Pin: </h2>
    <div class="game-pin">
      <h3>{{ gameId }}</h3>
    </div>

    <div class="players-list">
      <h2>Players:</h2>

        <p class="player-name" v-for="player in players" :key="player.user_id">
          {{ player.name }}
        </p>

    </div>

  </div>
</template>

<script>
export default {
  name: 'WaitingRoom',
  props:{
    gameId: String,
    players: Array,
  },

}
</script>

<style lang="css" scoped>
div.waiting-room {
  margin-top: 5%;
}

div.game-pin{
  border: 2px solid #a40d0f;
  padding: 10px 20px 10px 20px;
  display: inline-block;
  color: #a40d0f;
}

div.players-list {
  margin-top: 5%;
}

p.player-name {
  margin-top: 1%;
  font-size: 1em;
}
</style>
