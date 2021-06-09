<template>
  <div class="home">
    <div class="top-component">
      <img class="header-image" src="../assets/cat.png" alt="">
      <h2 class="header-text">A game for people who are into kittens and explosions and laser beams and sometimes goats</h2>
    </div>
    <Login />
    <div class="flier"><img src="../assets/bombCat.png" width="200"/></div>
  </div>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
  name: 'Home',
  components: { Login }
}
</script>

<style lang="css" scoped>
div.top-component {
  display: flex;
  margin-top: 5%;
}

img.header-image {
  width: 10em;
  flex-basis: 0;
  flex-grow: 1;
}

h2.header-text {
  flex-basis: 0;
  flex-grow: 2;
  margin-top: 100px;
  padding: 0 5em;
}

/* flying cat animation code */

.flier {
	pointer-events: none;
}

.flier > * {
/* Adjust animation duration to change the element’s speed */
        animation: fly 50s linear infinite;
        pointer-events: none !important;
	top: 0;
	left: 0;
	transform: translateX(-120%) translateY(-120%) rotateZ(0);
	position: fixed;
	animation-delay: 1s;
	z-index: 999999;
}

 /* Keyframe values control where the element will begin
    and end its trajectory across the screen. Each rule
    represents a path the element follows across the screen. */


@keyframes fly {

	98.001%, 0% {
                display: block;
		transform: translateX(-200%) translateY(100vh) rotateZ(0deg)
	}

	15% {
		transform: translateX(100vw) translateY(-100%A) rotateZ(0deg)
	}

	15.001%, 18% {
		transform: translateX(100vw) translateY(-30%) rotateZ(0deg)
	}

	40% {
		transform: translateX(-200%) translateY(3vh) rotateZ(-0deg)
	}

	40.001%, 43% {
		transform: translateX(-200%) translateY(-100%) rotateZ(0deg)
	}

	65% {
		transform: translateX(100vw) translateY(50vh) rotateZ(0deg)
	}

	65.001%, 68% {
		transform: translateX(20vw) translateY(-200%) rotateZ(0deg)
	}

	95% {
		transform: translateX(10vw) translateY(100vh) rotateZ(0deg)
	}
}


</style>
