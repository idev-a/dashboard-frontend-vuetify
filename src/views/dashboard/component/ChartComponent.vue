<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        :nudge-width="100"
        offset-y 
        offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          >
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <div
              @click="gotoRiskPage"
            >
              <highcharts  v-if="!loadingCard" :options="scoreChart"></highcharts>
            </div>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          {{tooltip.orgChart}}
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          >
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <div
              @click="gotoAnswersPage"
            >
              <highcharts v-if="!loadingCard" :options="riskLevelCharts"></highcharts>
            </div>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.riskLevels"></span>
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          >
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <div
              @click="gotoRiskUsersPage"
            >
              <highcharts v-if="!loadingCard" :options="highRiskUsers"></highcharts>
            </div>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.highRiskUsers"></span>
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          >
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <div
              @click="gotoRiskAppsPage"
            >
              <highcharts v-if="!loadingCard" :options="highRiskApps"></highcharts>
            </div>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.highriskApps"></span>
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          >
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <highcharts v-if="!loadingCard" :options="CIACharts"></highcharts>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.ciaChart"></span>
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      md="12"
      lg="9"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          > 
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <highcharts v-if="!loadingCard" :options="appUsersChart"></highcharts>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.usersForApps"></span>
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      md="12"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          > 
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <highcharts v-if="!loadingCard" :options="highriskCategoryChart"></highcharts>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.highriskByCategory"></span>
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      md="12"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCatLine"
          > 
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <v-row>
              <v-col cols="auto">
                <v-select
                  v-model="days"
                  label="Date Range Filter"
                  class="ml-5"
                  :items="daysItems"
                  @change="changeDateRange"
                />
              </v-col>
            </v-row>
            <highcharts v-if="!loadingCatLine" :options="highRiskByCatLineChart"></highcharts>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.highriskByCategory"></span>
        </v-sheet>
      </v-menu>
    </v-col>

    <v-col
      cols="12"
      md="12"
      v-if="false"
    >
      <v-menu  
        top 
        origin="center center"
        transition="scale-transition"
        close-on-content-click
        offset-y 
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="pt-3 min-50"
            :loading="loadingCard"
          > 
            <v-icon    
              v-bind="attrs"
              v-on="on"
              class="info-btn"
            >mdi-information</v-icon>
            <v-menu
              v-if="!loadingCard"
              bottom
              right
              offset-x
              v-model="categoryMenu"
              :nudge-width="200"
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
            <highcharts v-if="!loadingCard" :updateArgs="[true, false]" :options="ciaCategoryChart" ></highcharts>
          </v-card>
        </template>
        <v-sheet
          class="pa-4"
        >
          <span v-html="tooltip.ciaByCategory"></span>
        </v-sheet>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { BASE_API, Get } from '../../../api'
import { 
  riskLevelChart, 
  userRiskChart, 
  appRiskChart, 
  CIAChart, 
  scoreDonutChart, 
  appUsersChart, 
  highriskCategoryChart, 
  ciaCategoryChart,
  highRiskByCatLineChart
} from '../../../util'
import Highcharts from 'highcharts'
import { mapState, mapActions } from 'vuex'

  export default {
    name: 'ChartComponent',

    data () {
      return {
        loadingCard: false,
        loadingCatLine: false,
        tooltipMenu: false,
        charts: {},
        catLineChart: {},
        days: 30,
        daysItems: [1, 10, 20, 30],
        selectedCategories: [],
        cia_by_categories: [],
        categoryMenu: false,
        tooltip: {
          orgChart: 'This is a comprehensive Org Risk Score based off the current info/Data.',
          riskLevels: '',
          highriskUsers: '',
          highriskApps: '',
          ciaChart: 'These are the items that negatively impact Confidentiality, Integrity, & Availability. <a href="">Learn more</a>',
          ciaByCategory: '',
          highriskByCategory: 'List of all questions in your organization.  Choose Risk filter to see category type.',
          usersForApps: '',
          allQuestions: 'List of all questions in your organization.  Choose Risk filter to see category type.'
        }
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

        this.cia_by_categories = series
      },
      companyId: {
        handler(newValue) {
          if (newValue) {
            this.fetchChartsData(),
            this.fetchCatLineChart()
          }
        },
        immediate: true
      }
    },

    computed: {
      ...mapState(['companyId', 'companyName']),

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
        return CIAChart(this.charts.confidentiality, this.charts.integrity, this.charts.availability)
      },

      scoreChart () {
        return scoreDonutChart(this.charts.org_score)
      },

      appUsersChart () {
        return appUsersChart(this.charts.applications)
      },

      highriskCategoryChart () {
        return highriskCategoryChart(this.charts.high_risk_by_categories)
      },

      ciaCategoryChart () {
        return ciaCategoryChart(this.cia_by_categories, this.selectedCategories)
      },

      highRiskByCatLineChart () {
        return highRiskByCatLineChart(this.catLineChart)
      }
    },

    methods: {
      ...mapActions(['SET_TEMP_RISK']),

      async fetchChartsData() {
        this.loadingCard = true
        const res = await Get(`charts/${this.companyId}/all`)
        this.charts = res.charts
        this.selectedCategories = this.charts.cia_by_categories.categories
        this.loadingCard = false
      },

      async fetchCatLineChart(days=30) {
        this.loadingCatLine = true
        const res = await Get(`charts/${this.companyId}/category_line/${days}`)
        this.catLineChart = res
        this.loadingCatLine = false
      },

      changeDateRange (val) {
        this.fetchCatLineChart(val)
      },

      gotoRiskPage () {
        if (this.charts.org_score == 1) {
          this.$router.push({ name: 'Information Risks'})
        } else if (this.charts.org_score == 2) {
          this.$router.push({ name: 'Low Risks'})
        } else if (this.charts.org_score == 3) {
          this.$router.push({ name: 'Medium Risks'})
        } else if (this.charts.org_score == 4) {
          this.$router.push({ name: 'High Risks'})
        } else {
          this.$router.push({ name: 'Critical Risks'})
        }
      },
     _setTempRisk() {
        this.SET_TEMP_RISK([{ text: 'Critical', value: 'critical'},
          { text: 'High', value: 'high'}])
      },

      gotoRiskUsersPage () {
        this._setTempRisk()
        this.$router.push({ name: 'Users' })
      },

      gotoRiskAppsPage () {
        this._setTempRisk()
        this.$router.push({ name: 'Application Risk' })
      },

      gotoAnswersPage () {
        this._setTempRisk()
        this.$router.push({ name: 'Category' })
      }
    }
  }
</script>

<style lang="scss">
  .category-checkbox .theme--light.v-messages {
    display: none;
  }

  .max-200 {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .info-btn {
    position: absolute !important;
    top: 10px !important;
    right: 10px !important;
    z-index: 10;
    color: #2a9be7 !important;
  }
</style>