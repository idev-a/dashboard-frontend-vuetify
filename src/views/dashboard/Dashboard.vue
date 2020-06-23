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
          class="pt-3 min-50"
          :loading="loadingCard"
        >
          <highcharts v-if="!loadingCard" :options="scoreChart"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3 min-50"
          :loading="loadingCard"
        >
          <highcharts v-if="!loadingCard" :options="riskLevelCharts"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3 min-50"
          :loading="loadingCard"
        >
          <highcharts v-if="!loadingCard" :options="highRiskUsers"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3 min-50"
          :loading="loadingCard"
        >
          <highcharts v-if="!loadingCard" :options="highRiskApps"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <v-card
          class="pt-3 min-50"
          :loading="loadingCard"
        >
          <highcharts v-if="!loadingCard" :options="CIACharts"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="12"
        lg="9"
      >
        <v-card
          class="pt-3 min-50"
          :loading="loadingCard"
        >
          <highcharts v-if="!loadingCard" :options="appUsersChart"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="12"
      >
        <v-card
          class="pt-3 min-50"
          :loading="loadingCard"
        >
          <highcharts v-if="!loadingCard" :options="highriskCategoryChart"></highcharts>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="12"
      >
        <v-card
          class="pt-3 min-50"
          :loading="loadingCard"
        > 
          <v-menu
            v-if="!loadingCard"
            bottom
            right
            offset-x
            v-model="categoryMenu"
            :nudge-width="600"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on: menu }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn
                    class="ml-2 mb-2"
                    color="main"
                    dark
                    v-on="{ ...tooltip, ...menu }"
                  ><v-icon size="16" left dark>mdi-filter-menu-outline</v-icon>Filter by Categories</v-btn>
                </template>
                <span>Select multiple categories to display chart</span>
              </v-tooltip>
            </template>
            <v-card
              class="pa-2 pl-4 max-200"
            >
              <v-row v-if="!loadingCard">
                <v-col
                  class="pa-1 mr-0"
                  cols="6"
                  md="2"
                  v-for="item in charts.cia_by_categories.categories"
                  :key="item"
                  @click=""
                >
                  <v-checkbox color="red" class="category-checkbox dark pa-0 ma-0" v-model="selectedCategories" dense :label="item" :value="item"></v-checkbox>
                </v-col>
              </v-row>
            </v-card>
          </v-menu>
          <highcharts v-if="!loadingCard" :updateArgs="[true, false]" :options="ciaCategoryChart" :highcharts="ciaCategoryChartIns"></highcharts>
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
  import { riskLevelChart, userRiskChart, appRiskChart, CIAChart, scoreDonutChart, appUsersChart, highriskCategoryChart, ciaCategoryChart } from '../../util'
  import axios from 'axios'
  import Highcharts from 'highcharts'

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
        selectedCategories: [],
        cia_by_categories: [],
        ciaCategoryChartIns: Highcharts,
        categoryMenu: false
      }
    },

    watch:{
      selectedCategories () {
        let series = []
        let data = this.charts.cia_by_categories
        const _categories = data.categories.map(category => category.toLowerCase())
        data.series.map(item => {
          let temp = {
            name: item.name,
            data: []
          }
          this.selectedCategories.map(category => {
            const idx = _categories.indexOf(category.toLowerCase())
            if (idx > 0) {
              temp.data.push(item.data[idx])
            }
          })
          series.push(temp)
        })

        // this.refs.ciaCategoryChart.chart.setSeries(series)
        this.cia_by_categories = series
      },
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
        return highriskCategoryChart(this.charts.hishrisk_by_categories)
      },

      ciaCategoryChart () {
        return ciaCategoryChart(this.cia_by_categories, this.selectedCategories)
      }
    },

    async mounted () {
      let user = {}
      try {
        user = JSON.parse(localStorage.getItem('user'))
      } catch(e) {}
      this.companyId = user.email.split('@')[1];

      this.fetchChartsData()
      
      this.fetchAllCardData()
    },

    methods: {
      async fetchChartsData() {
        const res = await axios.get(`${BASE_API}/api/charts/${this.companyId}/all`)
        this.charts = res.data.charts
        this.selectedCategories = this.charts.cia_by_categories.categories
        this.loadingCard = false
      },

      async fetchAllCardData () {
        const res = await axios.get(`${BASE_API}/api/dashboard/${this.companyId}/all`)
        this.smallCards = res.data
        this.loading = false
      },
    },
  }
</script>

<style>
  .category-checkbox .theme--light.v-messages {
    display: none;
  }

  .max-200 {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>