<template>
  <div class="discard-pile">

    <h4>Discard Pile</h4>
    <div class="card fade-in-card">
      <h3>{{ this.cardType }}</h3>
      <p class="card-text">{{ this.cardText }}</p>
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
  padding: 5px;
  width: 13em;
  height: 15em;
  float: right;
  margin-right: 5%;
  margin-top: 1%;
}

div.card{
  border: 2px solid black;
  width:  8em;
  height: 10em;
  background-color: rgba(169,169,169, 0.7);
  margin-left: 18%;
  margin-top: 7%;
}

p.card-text {
  margin-top: 55%;
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
