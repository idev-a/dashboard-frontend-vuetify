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
        lg="4"
      >
        <highcharts  :options="riskLevelCharts"></highcharts>
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
          color="default"
          icon="mdi-alert-rhombus-outline"
          title="Other"
          :value="smallCards.other"
          sub-icon="mdi-chevron-triple-right"
          sub-text="View Details"
          hover
          ripple
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../api'
  import axios from 'axios'

  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        loading: false,
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
        }
      }
    },

    computed: {
      totalSales () {
        return this.sales.reduce((acc, val) => acc + val.salesInM, 0)
      },

      riskLevelCharts () {
        const totalRisks = Number(this.smallCards.high_risk) + Number(this.smallCards.medium_risk) + Number(this.smallCards.low_risk)
        let high = 0, medium = 0, low = 0
        if (totalRisks) {
          high = parseFloat((Number(this.smallCards.high_risk)/totalRisks*100).toFixed(2))
          medium = parseFloat((Number(this.smallCards.medium_risk)/totalRisks*100).toFixed(2))
          low = parseFloat((Number(this.smallCards.low_risk)/totalRisks*100).toFixed(2))
        }
        return {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Risk Levels'
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: false
                  },
                  showInLegend: true,
                  center: ['50%', '50%']
              }
          },
          series: [{
            name: 'Brands',
            colorByPoint: true,
            size: '80%',
            innerSize: '55%',
            data: [{
                name: 'High',
                y: high,
                sliced: true,
                selected: true,
                color: 'red',
                
            }, {
                name: 'Medium',
                y: medium,
                color: 'orange'
            }, {
                name: 'Low',
                y: low,
                color: 'yellow'
            }]
          }]
        }
      }
    },

    mounted () {
      this.fetchAllCardData()
    },

    methods: {
      fetchAllCardData () {
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/dashboard/${companyId}/all`, {
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
      complete (index) {
        this.list[index] = !this.list[index]
      },
    },
  }
</script>

<style>
  .highcharts-credits {
    display: none;
  }
</style>