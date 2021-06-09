<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">Rules</router-link>
    </div>
    <img class="logo" src="./assets/logo2.png" alt="">
    <router-view/>


  </div>
</template>

<script>

export default {
  name: "app",
  components: { },
}

</script>

<style>
* {
  box-sizing: border-box;
  margin: 0 ;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  background-color: #a40d0f;
  text-align: right;
}

#nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #white;
  text-decoration: none;
}

.logo {
  width: 20em;
  position: absolute;
  left: 2em;
  top: 1em;
}
</style>
