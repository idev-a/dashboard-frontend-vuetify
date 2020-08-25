<template>
  <v-main
    id="pages"
    :class="$vuetify.theme.dark ? undefined : 'white'"
  >
    <v-responsive
      class="d-flex align-center"
    >
      <router-view />
    </v-responsive>
  </v-main>
</template>

<script>
  export default {
    name: 'PagesCoreView',

    data: () => ({
      srcs: {
        '/pages/lock': 'lock.jpg',
        '/pages/login': 'login.jpg',
        '/pages/pricing': 'pricing.jpg',
        '/pages/register': 'register.jpg',
      },
    }),

    computed: {
      src () {
        return this.srcs[this.$route.path]
      },
      styles () {
        const paddingTop = this.$vuetify.breakpoint.mdAndUp ? 75 : 10
        const paddingBottom = this.$vuetify.breakpoint.mdAndUp ? 75 : 50
        return {
          padding: `${paddingTop}px 0 ${paddingBottom}px 0`,
        }
      },
    },
  }
</script>
