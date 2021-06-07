<template>
  <div class="home">
    <h1>Welcome to Exploding Kittens</h1>
    <Login />
  </div>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
  name: 'Home',
  components: { Login }
}
</script>
