<template>
  <div>
    <h1>Hello from waiting room</h1>
    <h3>Game Pin: </h3>
    <h4>{{ gameId }}</h4>

    <p>Players:</p>
    <ul>
      <li v-for="player in players" :key="player.user_id">
        {{ player.name }}
      </li>
    </ul>
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
</style>
