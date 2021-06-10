<template>
  <div class="discard-pile">
    <p>Discard Pile</p>
    <div class="card">
      <h3>{{ this.cardType }}</h3>
      <p>{{ this.cardText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'discardPile',
  props: {
    cardText: String,
    cardType: String
  },
  computed: {
  }
}
</script>

<style lang="css" scoped>
div.discard-pile {
  border: 2px dashed black;
  padding: 10px;
  height: 8em;
  width: 8em;
  position: absolute;
  right: 5%;
}

div.card{
  border: 2px solid black;
  height: 5em;
  width: 5em;
}
</style>
