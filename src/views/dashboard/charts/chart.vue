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
                    color="success"
                    dark
                    v-on="{ ...tooltip, ...menu }"
                  >Filter by Categories</v-btn>
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
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../../api'
  import { riskLevelChart, userRiskChart, appRiskChart, CIAChart, scoreDonutChart,appUsersChart, highriskCategoryChart, ciaCategoryChart } from '../../../util'
  import axios from 'axios'
  import Highcharts from 'highcharts'

  export default {
    name: 'DashboardChart',

    data: () => ({
      loadingCard: true,
      companyId: '',
      snack: false,
      snackColor: '',
      snackText: '',
      selectedCategories: [],
      cia_by_categories: [],
      ciaCategoryChartIns: Highcharts,
      categoryMenu: false
    }),

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

    methods: {
      fetchCharts () {
        const self = this
        axios(`${BASE_API}/api/charts/${this.companyId}/all`, {
            method: 'GET',
          })
            .then(function (res) {
              self.charts = res.data.charts
              self.selectedCategories = self.charts.cia_by_categories.categories
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
