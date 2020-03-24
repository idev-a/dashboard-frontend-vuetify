<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
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

      <v-col
        cols="12"
        md="12"
        lg="9"
      >
        <v-card
          class="pt-3"
          :loading="loadingCard"
        >
          <highcharts  :options="appUsersChart"></highcharts>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="12"
      >
        <v-card
          class="pt-3"
          :loading="loadingCard"
        >
          <highcharts  :options="highriskCategoryChart"></highcharts>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
       <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="red darken-4"
          icon="mdi-alert-outline"
          title="High Risks"
          :value="smallCards.high_risk"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View All High Risks"
          to="High Risks"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="red lighten-1"
          icon="mdi-alert-outline"
          title="Medium Risks"
          :value="smallCards.medium_risk"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View All Medium Risks"
          to="Medium Risks"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="yellow darken-1"
          icon="mdi-alert-outline"
          title="Low Risks"
          :value="smallCards.low_risk"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View All Low Risks"
          to="Low Risks"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="success"
          icon="mdi-alert-outline"
          title="Application Risk"
          :value="smallCards.applications"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View All Applications Data"
          to="Applications"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="secondary"
          icon="mdi-account-multiple"
          title="Users"
          :value="smallCards.users"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View Details"
          to="Users"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="secondary"
          icon="mdi-account-group-outline"
          title="Groups"
          :value="smallCards.groups"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View Details"
          to="Groups"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="secondary"
          icon="mdi-database"
          title="Public Data"
          :value="smallCards.public_data"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View Details"
          to="Public Data"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="red lighten-1"
          icon="mdi-security"
          title="Email Security"
          :value="smallCards.email_security"
          sub-icon="mdi-chevron-triple-right"
          sub-text="Email Settings, Pushing Attempts"
          to="Email Security"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="red lighten-1"
          icon="mdi-security"
          title="Network Security"
          :value="smallCards.network_security"
          sub-icon="mdi-chevron-triple-right"
          sub-text="Wifi, Internet"
          to="Network Security"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="red lighten-1"
          icon="mdi-security"
          title="Physial Security"
          :value="smallCards.physical_security"
          sub-icon="mdi-chevron-triple-right"
          sub-text="Doors, Alarms, Locks"
          to="Physical Security"
          hover
          ripple
        />
      </v-col>

       <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="red lighten-1"
          icon="mdi-security"
          title="Device Security"
          :value="smallCards.device_security"
          sub-icon="mdi-chevron-triple-right"
          sub-text="Doors, Alarms, Locks"
          to="Device Security"
          hover
          ripple
        />
      </v-col>

 
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="success"
          icon="mdi-poll"
          title="Charts"
          :value="smallCards.charts"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View Details"
          to="Charts"
          hover
          ripple
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="info"
          icon="mdi-link"
          title="Links"
          :value="smallCards.links"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View Details"
          flat
          dark
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          :loading="loading"
          color="info"
          icon="mdi-alert-rhombus-outline"
          title="Other"
          :value="smallCards.other"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View Details"
          dark
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../api'
  import { riskLevelChart, userRiskChart, appRiskChart, CIAChart, scoreDonutChart, appUsersChart, highriskCategoryChart } from '../../util'
  import axios from 'axios'

  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        loading: true,
        loadingCard: true,
        companyId: '',
        smallCards: {
          high_risk: '0',
          medium_risk: '0',
          low_risk: '0',
          other: '0',
          applications: '0',
          email_security: '0',
          network_security: '0',
          physical_security: '0',
          device_security: '0',
          company_info: '0',
          users: '0',
          groups: '0',
          public_data: '0',
          website: '0',
          alerts: '0',
          charts: '0',
          links: '0'
        },
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
          integrity: 0,
          applications: [],
          categories: []
        }
      }
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
      },

      appUsersChart () {
        return appUsersChart(this.charts.applications)
      },

      highriskCategoryChart () {
        return highriskCategoryChart(this.charts.categories)
      }
    },

    mounted () {
      let user = {}
      try {
        user = JSON.parse(localStorage.getItem('user'))
      } catch(e) {}
      this.companyId = user.email.split('@')[1];

      this.fetchAllCardData()

      this.fetchChartsData()
    },

    methods: {
      fetchChartsData() {
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

      fetchAllCardData () {
        const self = this
        axios(`${BASE_API}/api/dashboard/${this.companyId}/all`, {
            method: 'GET',
          })
            .then(function (res) {
              self.smallCards = res.data
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },
    },
  }
</script>
