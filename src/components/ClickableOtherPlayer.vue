<template>
  <div class="otherPlayers">
    <p>{{ playerName }}</p>
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
  div.deck{
    display: flex;
    justify-content: center;
  }

  div.card{
    width: 5em;
    height: 5em;
    background-color: grey;
    margin: 0 5px;
  }
</style>
