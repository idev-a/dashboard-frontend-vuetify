<template>
  <v-container
    id="company-users"
    fluid
    tag="section"
    class="px-5 py-3"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3"
          :loading="loadingCard"
        >
          <highcharts :options="scoreChart"></highcharts>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3"
          :loading="loadingCard"
        >
          <highcharts :options="riskLevelCharts"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3"
          :loading="loadingCard"
        >
          <highcharts  :options="highRiskUsers"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3"
          :loading="loadingCard"
        >
          <highcharts  :options="highRiskApps"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3"
          :loading="loadingCard"
        >
          <highcharts  :options="CIACharts"></highcharts>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../../api'
  import { riskLevelChart, userRiskChart, appRiskChart, CIAChart, scoreDonutChart } from '../../../util'
  import axios from 'axios'

  export default {
    name: 'DashboardChart',

    data: () => ({
      loadingCard: true,
      companyId: '',
      search: '',
      snack: false,
      snackColor: '',
      snackText: '',
      pagination: {},
      charts: {
        org_score: 0,
        high_risk: 0,
        medium_risk: 0,
        low_risk: 0,
        user_high: 0,
        user_medium: 0,
        user_low: 0,
        app_high: 0,
        app_medium: 0,
        app_low: 0,
        confidentiality: 0,
        availability: 0,
        integrity: 0
      }
    }),

    mounted () {
      let user = {}
      try {
        user = JSON.parse(localStorage.getItem('user'))
      } catch(e) {}
      this.companyId = user.email.split('@')[1];

      this.fetchCharts()
    },

    computed: {
      riskLevelCharts () {
        return riskLevelChart(this.charts.high_risk, this.charts.medium_risk, this.charts.low_risk)
      },

      highRiskUsers () {
        return userRiskChart(this.charts.user_high, this.charts.user_medium, this.charts.user_low)
      },

      highRiskApps () {
        return appRiskChart(this.charts.app_high, this.charts.app_medium, this.charts.app_low)
      },

      CIACharts () {
        return CIAChart(this.charts.confidentiality, this.charts.availability, this.charts.integrity)
      },

      scoreChart () {
        return scoreDonutChart(this.charts.org_score)
      }
    },

    methods: {
      fetchCharts () {
        const self = this
        axios(`${BASE_API}/api/charts/${this.companyId}/all`, {
            method: 'GET',
          })
            .then(function (res) {
              self.charts = res.data.charts
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loadingCard = false
            })
      },
    }
  }
</script>
