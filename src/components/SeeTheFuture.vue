<template>
  <div class="future-pop-up">
    <h4 class="header">The future 3 cards are: </h4>
    <div class="card-set">
      <div class="card" v-for="card in cards" :key="card.id">
        <h3>{{ card.cardType }}</h3>
        <p class="card-text">{{ card.text }}</p>
      </div>
    </div>
    <button class="done" @click="continueGame">Done</button>
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
h4.header {
  margin-bottom: 3%
}

div.future-pop-up{
  position: absolute;
  left: 36%;
  top: 28%;
  border-left: 14px solid #e3277c;
  background-color: #FADADD;
  padding: 10px;
}

div.card-set{
  display: flex;
  justify-content: center;
}

div.card{
  border: 2px solid black;
  width: 8em;
  height: 10em;
  border-radius: 5px;
  margin: 0px 5px;
  background-color: white;
}

p.card-text {
  margin-top: 55%;
}

button.done {
  font-size: 18px;
  padding: 5px;
  border: 2px solid #e3277c;
  background-color: #e3277c;
  color: white;
  border-radius: 5px;
  margin-top: 3%;
}

button.done:hover {
  background-color: white;
  color: #e3277c;
  font-weight: 600;
}
</style>
