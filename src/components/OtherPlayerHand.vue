<template>
  <div class="otherPlayers" v-bind:class="{alive: alive}">
    <h4>{{ player.name}}</h4>
    <div class="deck">
      <div v-for="card in player.hand" :key="card.id" class="card"></div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'OtherPlayerHand',
  props: {
    player: Object
  },
  computed: {
    alive(){
      return this.player.alive;
    }
  }
}
</script>

<style lang="css" scoped>

div.otherPlayers {
  width: 15em;
  border: 2px solid black;
  display: inline-block;
  margin: 0em 2em;
  padding-top: 10px;
  background-color: rgba(164, 13, 15, 0.5);
}

div.deck {
  display: flex;
  justify-content: center;
}

div.card {
  border: 2px solid #A9A9A9;
  background-color: #C0C0C0;
  height: 4em;
  width: 4em;
  margin: 0em 5px;;
}

div.alive {
  background-color:  rgba(169, 169, 169, 0);
}
</style>
