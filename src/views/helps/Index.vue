<template>
  <v-app>
    <pages-core-app-bar />
    
    <pages-core-view />

    <help-core-footer />
    
    <dashboard-core-footer />
  </v-app>
</template>

<script>
  export default {
    name: 'PagesIndex',

    components: {
      PagesCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreFooter: () => import('../dashboard/components/core/Footer'),
      HelpCoreFooter: () => import('./components/core/PageFooter'),
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
.help-title {
  font-size: 30px;
  margin-bottom: 1.875rem;
}
</style>
