<template>
  <div class="sign-in">
    <div class="user-components">
      <h1 class="hello" v-if="this.usernameFilled === true">Hello {{ this.username }}</h1>
      <h4 v-if="this.usernameFilled === false">Start playing by signing-in</h4>
      <form v-if="this.usernameFilled === false" @submit.prevent="onSubmit">
        <!-- <label>
          Username: -->
        <div class="cursor">
          <input class="enter-username" :value="username" @input="setUsername" placeholder="  username" autofocus required/>
        <!-- </label> -->
          <i></i>
        </div>
        <button class="start"><p><i class="arrow right"></i></p></button>
      </form>

      <div v-if="this.usernameFilled">
        <router-link class="join-or-create host" :to="{ name: 'hostGame'}" tag="button">Host Game</router-link>
        <router-link class="join-or-create join" :to="{ name: 'joinGame'}" tag="button">Join Game</router-link>
      </div>
    </div>

    <img class="cards" src="../assets/catCards.png" alt="">
  </div>

</template>

<script>
import firebase from "firebase";
import uuid from "uuid";

export default {
  name: 'Login',
  data() {
    return {
      usernameFilled: false,

    }
  },
  computed: {
    username() {
      return this.$store.state.user.username
    }
  },
  created() {
    console.log("created");
    // when the page is created, get all users from the database
    firebase.database()
      .ref("users")
      .on("value", snapshot => {
        console.log(snapshot.val());
        if (snapshot.val()) {
          this.$store.commit("setAllUsers", snapshot.val());
        }
      })
  },
  methods: {

    onSubmit() {
      if(this.$store.state.username !== ''){
        this.usernameFilled = true;
      }
      console.log(this.$store.state.user.name);
      const userObject = this.$store.state.allUsers.find(u => u.username === this.$store.state.user.name);

      if(userObject) { // we find a match within existing allUsers
        this.$store.state.user = userObject;
        return;
      }

      // if no match was found, then create a new database instance
      const user_id = uuid();
      const newUser = { username: this.$store.state.user.name, user_id: user_id, games: [], currentCards: [] };
      console.log(newUser);
      firebase.database()
        .ref(`users`)
        .set([...this.$store.state.allUsers, newUser]);

      this.$store.state.user = newUser;

    },
    setUsername(event) { // changes username state as user types
      this.$store.commit("setUsername", event.target.value);
    }
  }
};
</script>

<style lang="css" scoped>
div.sign-in {
  text-align: left;
  padding-left: 5%;
  height: 8em;
  margin-top: 5%;
  display: inline-border;
}

input.enter-username {
  border: none;
  border-bottom: 2px solid black;
  font-size: 2em;
  margin-top: 2%
}

input:focus{
    outline: 0;
}

.start {
  background-color: rgba(0,0,0,0);
  border: none;
  display: inline;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.join-or-create {
  margin: 10px 20px 10px 0px;
  font-size: 1em;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
}

.host {
  border: 2px solid #a40d0f;
  color: #a40d0f;
}

.host:hover {
  color: white;
  font-weight: 600;
  background-color: #a40d0f;
}

.join {
  border: 2px solid #f26624;
  color: #f26624;
}

.join:hover {
  color: white;
  font-weight: 600;
  background-color: #f26624;
}

.cursor {
    position: relative;
    display: inline;
}
.cursor i {
    position: absolute;
    width: 1px;
    height: 150%;
    background-color: gray;
    left: 5px;
    top: -50%;
    animation-name: blink;
    animation-duration: 800ms;
    animation-iteration-count: infinite;
    opacity: 1;
}

.cursor input:focus + i {
    display: none;
}

@keyframes blink {
    from { opacity: 1; }
    to { opacity: 0; }
}

div.sign-in {
  display: flex;
  margin-top: 0px;
}

div.user-components {
  flex-basis: 0;
  flex-grow: 2;
  margin-top: 100px;
  padding: 0 5em;
}

img.cards {
  flex-basis: 0;
  flex-grow: 2;
  height: 20em;
  margin-right: 5%
}

.hello {
  font-size: 4em;
}

</style>
