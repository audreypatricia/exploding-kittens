import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CreateGame from '../views/CreateGame.vue'
import JoinGame from '../views/JoinGame.vue'
import GamePlay from '../views/GamePlay.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/host',
    name: 'hostGame',
    component: CreateGame
  },
  {
    path: '/join',
    name: 'joinGame',
    component: JoinGame
  },
  {
    path: '/game/:id',
    name: 'game',
    component: GamePlay
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
