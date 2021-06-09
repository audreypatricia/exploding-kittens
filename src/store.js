import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

Vue.config.devtools = true;

export default new Vuex.Store({
  state: {
    user: {},
    gameName: '',
    gameId: '',
    allUsers: [],
    activeGame: null,
    players: [],
    gameStart: false,
    cardDeck: [],
    playerTurn: null,
    favor: false,
    seeFuture: false,
    attack: false,
    combo: false,
    comboNum: 0,
    discardPile: [],
    winner: '',
  },

  getters: {

  },

  mutations: {
    setUsername (state, username) {
      state.user.name = username;
    },
    setGameName (state, gameName) {
      state.gameName = gameName;
    },
    setGameId (state, gameId) {
      state.gameId = gameId;
    },
    setAllUsers (state, allUsers) {
      state.allUsers = allUsers;
    },
    setActiveGame (state, activeGame) {
      state.activeGame = activeGame;
    },
    setPlayers (state, players) {
      state.players = players;
    },
    setGameStart (state, gameStart) {
      state.gameStart = gameStart;
    },
    setCardDeck (state, cardDeck) {
      state.cardDeck = cardDeck;
    },
    setPlayerTurn (state, playerTurn) {
      state.playerTurn = playerTurn;
    },
    setFavor (state, favor) {
      state.favor = favor;
    },
    setFuture (state, future) {
      state.seeFuture = future;
    },
    setAttack (state, attack) {
      state.attack = attack;
    },
    setCombo (state, combo) {
      state.combo = combo;
    },
    setComboNum (state, comboNum) {
      state.comboNum = comboNum;
    },
    setDiscardPile (state, discardPile) {
      state.discardPile = discardPile;
    },
    setWinner (state, winner) {
      state.winner = winner;
    },
  },


});
