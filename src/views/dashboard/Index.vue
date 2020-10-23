<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" />

    <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" />

    <dashboard-core-view />

    <!-- <dashboard-core-settings v-model="expandOnHover" /> -->
  </v-app>
</template>

<script>
  import { BASE_API, Post } from '@/api'
  import { mapState } from 'vuex'
  
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
    }),

    watch: {
      async isIdle (val) {
        if (val) {
          const data = {
            id: this.userId,
          }
          const res = await Post(`users/login/keep`, data)
          if (res.status === 'ok') {
            if (res.is_required) {
              this.$router.push({ name: 'Lock' })
            }
          } 
        }
      }
    },
    computed: {
      ...mapState(['userId']),

      isIdle() {
        return this.$store.state.idleVue.isIdle;
      }
    }
  }
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, .05);
}
.highcharts-credits {
  display: none;
}

tr.v-data-table__mobile-table-row:nth-of-type(odd) td.v-data-table__mobile-row{
  background: rgba(0, 0, 0, .05);
}

.theme--light.v-data-table thead tr:last-child th {
  /*background: #64B5F6;*/
  font-weight: 500 !important;
}

.v-data-table__mobile-row {
  height: auto !important;
}

.v-data-table__mobile-row .v-data-table__mobile-row__cell {
  height: auto !important;
}

.bg-dead {
  background: #E0E0E;
}

.min-50 {
  min-height: 50px;
}

.max-height-300 {
  max-height: 300px;
}

.max-width-300 {
  max-width: 300px;
}

.banner-bg {
  margin: auto;
  --saf-0: rgba(var(--sk_foreground_low_solid,221,221,221),1);
  border: 1px solid var(--saf-0);
  padding: 1rem 1rem 1rem 1rem !important;
/*  background-color: rgba(var(--sk_primary_background,255,255,255),1);
  background-image: url(../../assets/banner-bg.png);
  background-size: 60px 60px;
  background-repeat: no-repeat;
  background-position: 1.25rem;*/
}
</style>
