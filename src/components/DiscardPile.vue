<template>
  <div class="discard-pile">
    <p>Discard Pile</p>
    <div class="card fade-in-card">
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
    cardType: String, 
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
  background-color: rgba(169,169,169, 0.7);
}

.fade-in-card {
  animation: fadeIn 4s;
  -webkit-animation: fadeIn 4s;
  -moz-animation: fadeIn 4s;
  -o-animation: fadeIn 4s;
  -ms-animation: fadeIn 4s;
}
@keyframes fadeIn {
  0% {
    opacity:0;
    background-color: white;
  }
  100% {
    opacity:1;
    background-color: rgba(169,169,169, 0.7);
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity:0;
    background-color: white;
  }
  100% {
    opacity:1;
    background-color: rgba(169,169,169, 0.7);
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity:0;
    background-color: white;
  }
  100% {
    opacity:1;
    background-color: rgba(169,169,169, 0.7);
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity:0;
    background-color: white;
  }
  100% {
    opacity:1;}
    background-color: rgba(169,169,169, 0.7);
}

@-ms-keyframes fadeIn {
  0% {
    opacity:0;
    background-color: white;
  }
  100% {
    opacity:1;
    background-color: rgba(169,169,169, 0.7);
  }
}
</style>
