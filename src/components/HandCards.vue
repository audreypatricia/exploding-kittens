<template>
<div class="deck" v-bind:class="{ alive: alive }" >
  <p>Your cards: </p>

    <div class="card" :class="card.cardType" v-for="card in hand" :key="card.id" @click="playCard(card.cardType, card.id)">
      <h3>{{card.cardType}}</h3>
      <!-- <img class="card-img" src="../assets/fireKitty.png" alt=""> -->
      <p class="bottom">{{card.text}}</p>
    </div>

  <!-- <div v-for="test in tests" :key="test">{{ test }}</div> -->
</div>
</template>

<script>
import { db } from '../helpers/db';
import { gameLogic } from '../helpers/GameLogic';

export default {
  name: 'HandCards',
  props: {
    players: [],
    username: String,
    comboCards: []
  },
  computed: {
    hand(){
      let player = this.players.filter(p => p.name === this.username);
      return player[0].hand;
    },
    playerTurn(){
      return this.$store.state.playerTurn;
    },
    cardDeck(){
      return this.$store.state.cardDeck;
    },
    alive(){
      let player = this.players.filter(p => p.name === this.username);
      return player[0].alive;
    }
  },
  created(){
    db.NopeableListener(this.$store.state.activeGame);
  },
  methods: {
    playCard(cardType, cardId){
      let regex = /combo([0-9])?/;

      if(this.playerTurn === this.username || cardType === 'nope'){

        // place card in discard pile
        gameLogic.discardCard(cardId, this.players, this.username);

        db.setNopeableTrue(); // making nopeable true


        let moveNotification = `${this.$store.state.user.username} played a ${cardType}`;
        this.$emit('moveNotification', moveNotification);

        let comboMatch = cardType.match(regex);

        if(comboMatch){ // if selected card is a combo card
          if(this.$store.state.comboNum == 0){
            this.$store.commit("setComboNum", comboMatch[1])
          }


          // matching combo cards validation
          if(this.$store.state.comboNum != 0){
              if(comboMatch[1] != this.$store.state.comboNum){
                let moveNotification = `${this.$store.state.user.username} combo cards do not match, choose only combo${comboMatch[1]} cards`;
                this.$emit('moveNotification', moveNotification);
                return;
              }
            }
          // matching combo cards validation

          console.log("combo match found");
          this.comboCards.push(cardId);
          this.$emit('getComboCards', this.comboCards)

          setTimeout( () => {

            if(this.$store.state.nopeable === "played"){

              // message saying nope has been played
              let moveNotification = `A nope card was played against ${this.$store.state.user.username}`;
              this.$emit('moveNotification', moveNotification);

              // handle putting card back into players hand
              gameLogic.returnCard(this.$store.state.discardPile, this.$store.state.user.username, this.$store.state.players);
              return;

            } else {
              // if nope has not been played then handleMove
              gameLogic.handleMove("combo");
            }

            db.setNopeableFalse();

          }, 3000); // after 5 seconds set nopeable to false and handle logic is nope has not been played


        } else { // if any other card
          db.setNopeableTrue();

          if(cardType === 'nope' && this.$store.state.nopeable === "true"){
            db.setNopeablePlayed();
          }

          setTimeout( () => {

            if(this.$store.state.nopeable === "played"){

              // message saying nope has been played
              let moveNotification = `A nope card was played against ${this.$store.state.user.username}`;
              this.$emit('moveNotification', moveNotification);

              // handle putting card back
              gameLogic.returnCard(this.$store.state.discardPile, this.$store.state.user.username, this.$store.state.players);
              return;
            }else {
              gameLogic.handleMove(cardType, this.cardDeck, this.username, this.players);

            }

            db.setNopeableFalse();

          }, 3000); // after 5 seconds set nopeable to false and handle logic is nope has not been played

        }




      } else {
        console.log("not your turn");
      }

      // if(this.$store.state.combo === false){
      //   this.comboCards = [];
      // }
    }
  }
}
</script>

<style lang="css" scoped>
div.deck {
  display: flex;
  justify-content: center;
  border: 2px dashed black;
  padding: 2em;
  background-color: rgba(169, 169, 169, 0.5);
  position: fixed;
  bottom: 3%;
  left: 50%;
  padding: 20px;
  transform: translate(-50%, 0);
}

p.bottom {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 0);
}

div.alive {
  background-color:  rgba(169, 169, 169, 0);
}

div.card{
  border: 4px solid black;
  width: 11em;
  height: 13em;
  margin: 0em 1em;
  position: relative;
  border-radius: 5px;
}

img.card-img {
  height: 5em;
  width: 5em;
  margin-top: 16%;
}

div.skip {
  border: 4px solid #077bc1;
  background: url("../assets/skip.png");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.attack {
  border: 4px solid #f36625;
  background: url("../assets/attack.png");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.future {
  border: 4px solid #e3277c;
  background: url("../assets/future.png");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.nope {
  border: 4px solid #aa1825;
  background: url("../assets/nope.gif");
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.favor {
  border: 4px solid #282928;
  background: url("../assets/favor.png");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.defuse {
  border: 4px solid #91c740;
  background: url("../assets/defuse.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.shuffle {
  border: 4px solid #cab099;
  background: url("../assets/shuffle.png");
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center;
}

div.combo1{
  border: 4px solid transparent;
  border-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
  border-image-slice: 1;
  background: url("../assets/hrngCat.png");
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.combo2{
  border: 4px solid transparent;
  border-image: linear-gradient(to bottom right, #b82d2f 0%, #F8b602 25%, #b9d982 50%, #6dbd3d 75%, #983d00 100%);
  border-image-slice: 1;
  background: url("../assets/tacoCat.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.combo3{
  border: 4px solid transparent;
  border-image: linear-gradient(to bottom right, #3b3837 0%, #f4d7c7 50%);
  border-image-slice: 1;
  background: url("../assets/beardCat.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.combo4{
  border: 4px solid transparent;
  border-image: linear-gradient(to bottom right, #a67b4f 0%, #755633 50%);
  border-image-slice: 1;
  background: url("../assets/hairyPotatoCat.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}

div.combo5{
  border: 4px solid transparent;
  border-image: linear-gradient(to bottom right, #4da74f 0%, #297154 33%, #82c831 67%, #000000 100%);
  border-image-slice: 1;
  background: url("../assets/cattermelon.png");
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 5px;
}
</style>
