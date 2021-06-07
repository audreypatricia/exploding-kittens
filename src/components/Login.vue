<template>
  <div>
    <form @submit.prevent="onSubmit">
      <label>
        Username:
        <input :value="username" @input="setUsername" required/>
      </label>
      <button>Start!</button>
    </form>



    <div v-if="this.usernameFilled">
      <router-link :to="{ name: 'hostGame'}" tag="button">Host Game</router-link>
      <router-link :to="{ name: 'joinGame'}" tag="button">Join Game</router-link>
    </div>
  </div>

</template>

<script>
import firebase from "firebase";
import uuid from "uuid";

export default {
  name: 'Login',
  data() {
    return {
      usernameFilled: false
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
</style>
