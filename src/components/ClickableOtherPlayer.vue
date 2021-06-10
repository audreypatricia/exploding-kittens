<template>
  <div class="otherPlayers">
    <h4>{{ playerName }}'s cards</h4>
    <div class="deck">
      <div v-for="card in cards" @click="handleSteal(card.id)" :key="card.id" class="card"></div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'ClickableOtherPlayer',
  props: {
    playerName: String,
    cards: Array
  },
  methods: {
    handleSteal(cardId) {
      this.$emit('handleSteal', cardId);
    }
  },
  created() {
    console.log(this.cards);
  }
}
</script>

<style lang="css" scoped>
div.otherPlayers{
  margin-top: 2%;
}
  div.deck{
    display: flex;
    justify-content: center;
  }

  div.card{
    border: 2px solid #A9A9A9;
    background-color: #C0C0C0;
    height: 4em;
    width: 4em;
    margin: 0em 5px;;
  }
</style>
