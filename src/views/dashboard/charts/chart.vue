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
          @click="gotoRiskPage"
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
          @click="gotoAnswersPage"
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
          @click="gotoRiskUsersPage"
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
          @click="gotoRiskAppsPage"
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
      <v-col>
        <v-card
          class="py-4"
        >
          <v-card-title>
            Custom Charts
          </v-card-title>
          <v-card-text>
            <v-col
              cols='12'
              md="6"
            >
              <v-select
                v-model="custom_id"
                :loading="loadingCard"
                :items="customCharts"
                item-value="id"
                item-text="label"
                class=""
                label="Select a custom chart"
                hint="Select a custom chart"
                @input="selectCustomChart"
              ></v-select>
            </v-col>
            <v-row>
              <v-col
                cols='12'
                md="5"
                v-if="!loading && donePie"
              >
                <v-sheet class="min-50">
                  <highcharts  :options="pieChart"></highcharts>
                </v-sheet>
              </v-col>
              <v-col
                cols='12'
                md="6"
                v-if="!loading && doneBar" 
              >
              <v-sheet class="min-50">
                  <highcharts :options="barChart"></highcharts>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
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
  import { 
    riskLevelChart,
    userRiskChart,
    appRiskChart,
    CIAChart,
    scoreDonutChart,
    appUsersChart,
    highriskCategoryChart,
    ciaCategoryChart,
    pieChart,
    barchart
  } from '../../../util'
  import axios from 'axios'
  import Highcharts from 'highcharts'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'DashboardChart',

    data: () => ({
      loadingCard: true,
      loading: false,
      donePie: false,
      doneBar: false,
      snack: false,
      snackColor: '',
      snackText: '',
      selectedCategories: [],
      cia_by_categories: [],
      ciaCategoryChartIns: Highcharts,
      categoryMenu: false,
      customCharts: [],
      title: '',
      custom_data: null,
      total: 0,
      custom_id: '',
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

    async mounted () {
      await this.fetchCharts()

      await this.fetchCustomCharts()
    },

    computed: {
      ...mapState(['companyId']),

      riskLevelCharts () {
        return riskLevelChart(this.charts.critical_risk, this.charts.high_risk, this.charts.medium_risk, this.charts.low_risk, this.charts.informational_risk)
      },

      highRiskUsers () {
        return userRiskChart(this.charts.user_critical, this.charts.user_high, this.charts.user_medium, this.charts.user_low, this.charts.user_informational)
      },

      highRiskApps () {
        return appRiskChart(this.charts.app_critical, this.charts.app_high, this.charts.app_medium, this.charts.app_low, this.charts.app_informational)
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
      },

      pieChart () {
        return pieChart(this.title, this.custom_pie_data, this.total)
      },

      barChart () {
        return barchart(this.title, '', '#', this.custom_bar_data)
      },
    },

    methods: {
      ...mapActions(['SET_TEMP_RISK']),

      async fetchCharts () {
        this.loadingCard  = true
        try {
          const res = await axios(`${BASE_API}/api/charts/${this.companyId}/all`, {
              method: 'GET',
          })
          this.charts = res.data.charts
          this.selectedCategories = res.data.charts.cia_by_categories.categories
        } catch (e) {
          console.log(e)
        } finally {
          this.loadingCard = false
        }
      },

      async fetchCustomCharts () {
        this.loadingCard  = true
        try {
          const res = await axios({
            url: `${BASE_API}/api/admin/chart/readall`,
            method: 'GET'
          })
          this.customCharts = res.data.data
          // this.customs = this.customCharts.map(item => )
        } catch (e){
          console.log(e)
        }  finally {
          this.loadingCard = false
        }
      },

      async selectCustomChart (id) {
        const item = this.customCharts.filter(chart => chart.id == id)[0]
        this.loading = true
        this.donePie = false
        this.doneBar = false
        try {
          const data =  { 
            company_id_field: item.company_id_field,
            targetTable: item.target_table,
            conditions: item.conditions,
            chartType: item.type,
            dataLabel: item.data_label,
            company: this.companyId,
            label: item.label,
            title: item.title
          }
          const res = await axios({
            url: `${BASE_API}/api/admin/chart/test`,
            method: 'POST',
            data
          })
          const chartType = item['type']
          if (chartType == 'Pie Chart') {
            this.custom_pie_data = res.data.data[chartType]
            this.donePie = true
          } else {
            this.doneBar = true
            this.custom_bar_data = res.data.data[chartType]
          }
          this.title = item.title
          this.total = res.data.total
          // this.customs = this.customCharts.map(item => )
        } catch (e){
          console.log(e)
        }  finally {
          this.loading = false
        }
      },

      gotoRiskPage () {
        if (this.charts.org_score < 3) {
          this.$router.push({ name: 'Low Risks'})
        } else if (this.charts.org_score == 3) {
          this.$router.push({ name: 'Medium Risks'})
        } else {
          this.$router.push({ name: 'High Risks'})
        }
      },

      gotoRiskUsersPage () {
        this.SET_TEMP_RISK([{ text: 'Critical', value: 'critical'},
          { text: 'High', value: 'high'}])
        this.$router.push({ name: 'Users' })
      },

      gotoRiskAppsPage () {
        this.SET_TEMP_RISK([{ text: 'Critical', value: 'critical'},
          { text: 'High', value: 'high'}])
        this.$router.push({ name: 'Application Risk' })
      },

      gotoAnswersPage () {
        this.SET_TEMP_RISK([{ text: 'Critical', value: 'critical'},
          { text: 'High', value: 'high'}])
        this.$router.push({ name: 'Category' })
      }
    }
  }
</script>
