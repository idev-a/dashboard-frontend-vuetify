<template>
  <v-app>
    <dashboard-core-app-bar v-model="expandOnHover" />

    <dashboard-core-drawer :expand-on-hover.sync="expandOnHover" />

    <dashboard-core-view />

    <!-- <dashboard-core-settings v-model="expandOnHover" /> -->

  </v-app>
</template>

<script>
  import { BASE_API } from '../../api'
  import axios from 'axios'
  
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
      isIdle (val) {
        if (val) {
          let user = {}
          try {
            user = JSON.parse(localStorage.getItem('user'))
          } catch(e) {}
          const self = this
          self.loading = true
          const data = {
            id: user.id,
          }
          axios({
            url:`${BASE_API}/api/users/login/keep`,
            method: 'POST',
            data,
            withCredentials: false,
            crossdomain: true,
          })
            .then(function (res) {
              self.loading = false
              if (res.data.status === 'ok') {
                if (res.data.is_required) {
                  this.$router.push({ name: 'Lock' })
                }
              } 
            })
            .catch(error => {
              console.log(error)
              self.loading = false
            })
        }
      }
    },
    computed: {
      isIdle() {
        return this.$store.state.idleVue.isIdle;
      }
    }
  }
</script>

<style type="text/css">
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
</style>
