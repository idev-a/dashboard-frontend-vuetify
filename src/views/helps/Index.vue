<template>
  <v-app>
    <pages-core-app-bar />
    
    <pages-core-view />

    <!-- <pages-core-footer /> -->
    <dashboard-core-footer />
  </v-app>
</template>

<script>
  export default {
    name: 'PagesIndex',

    components: {
      PagesCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreFooter: () => import('../dashboard/components/core/Footer'),
      // PagesCoreFooter: () => import('./components/core/Footer'),
      PagesCoreView: () => import('./components/core/View'),
    },

    created () {
      this.$vuetify.theme.dark = false
    },

    beforeDestroy () {
      this.$vuetify.theme.dark = false
    },
  }
</script>

<style>
  footer {
    background: #f5f5f5 !important;
  }
</style>
