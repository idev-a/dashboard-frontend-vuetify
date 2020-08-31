<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-banner
      v-model="banner"
      single-line
    >
      <v-card
        class="ma-1"
        flat
        :elevation="1"
      >
        <v-card-text>
          <div class="d-flex align-center justify-space-between" >
            <div>
              Welcome <b>{{upperFirst(companyName)}}</b> to the Secure dashboard.  Click <a href="#">here</a> to learn more about the dashboard. 
            </div>
            <v-btn text icon @click="banner = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-banner>
    
    <chart-component />

    <stats-component />
    
  </v-container>
</template>

<script>
import upperFirst from 'lodash/upperFirst'
import { mapState } from 'vuex'

export default {
  components: {
    ChartComponent: () => import('../component/ChartComponent'),
    StatsComponent: () => import('./StatsComponent')
  },

  data() {
    return {
      banner: true
    }
  },
  methods: {
    upperFirst,
  },
  computed: {
    ...mapState(['companyName']),
  }
}
</script>