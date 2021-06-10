<template>
  <div class="winner-box">
    <h1>The Winner is: {{ this.winner }}</h1>
    <p>{{ this.winner }} has world domination</p>
    <img class="win-kitty" src="../assets/fireKitty.png" alt="">
    <router-link class="home" :to="{ name: 'home'}" tag="button">Home</router-link>
  </div>
</template>

<script>
export default {
  props: {
    winner: String,
  }
}
</script>

<style lang="css" scoped>

div.winner-box {
  text-align: center;
  padding: 3em;
  position: relative;
  z-index: 2;
  height: 242px;
  display: inline-block;
  width: 55em;
  background-color: #a40d0f;
  color: white
}

img.win-kitty{
  height: 8em;
  width: 8em;
}

.home {
  margin: 10px 20px 10px 0px;
  font-size: 1em;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  border: 2px solid #f26624;
  color: #f26624;
  position: absolute;
  bottom: 7px;
  right: 30%;
}

.home:hover {
  color: white;
  font-weight: 600;
  background-color: #f26624;
}
</style>
