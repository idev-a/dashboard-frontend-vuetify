<template>
  <router-view />
</template>

<script>
  export default {
    name: 'App',
    computed: {
		isIdle() {
			console.log(this.$store.state.idleVue.isIdle)
	      	return this.$store.state.idleVue.isIdle;
	  	}
  	}
  }
</script>
