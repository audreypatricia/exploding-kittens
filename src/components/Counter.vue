<template>
  <div>
    <h1>{{ count }}</h1>
    <button v-on:click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  name: 'store',
  computed: {
    count() {
      return this.$store.state.count
    },
  },
  methods: {
    increment() {
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
