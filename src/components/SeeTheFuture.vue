<template>
  <div>
    <p>The future 3 cards are: </p>
    <div class="card-set">
      <div class="card" v-for="card in cards" :key="card.id">
        <h3>{{ card.cardType }}</h3>
        <p>{{ card.text }}</p>
      </div>
    </div>
    <button @click="continueGame">Done</button>
  </div>
</template>

<script>

export default {
  name: 'Future',
  props: {
    cards: []
  },
  methods: {
    continueGame(){
      this.$store.commit('setFuture', false);
    }
  },
  created() {
    console.log(this.cards);
  }
}
</script>

<style lang="css" scoped>
div.card-set{
  display: flex;
  justify-content: center;
}

div.card{
  border: 2px solid black;
  width: 8em;
  margin: 0px 5px;
}
</style>
