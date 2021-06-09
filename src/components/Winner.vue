<template>
  <div class="winner-box">
    <h1>The Winner is:</h1>
    <h1>{{ this.winner }}</h1>
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
}
</style>
