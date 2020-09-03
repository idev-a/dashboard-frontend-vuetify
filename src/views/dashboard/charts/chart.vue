<template>
  <v-container
    id="company-users"
    fluid
    tag="section"
    class="px-5 py-3"
  >
    <chart-component />

    <v-row>
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
  </v-container>
</template>

<script>
  import { BASE_API, Get, Post } from '../../../api'
  import { 
    pieChart,
    barchart
  } from '../../../util'
  import Highcharts from 'highcharts'
  import { mapState } from 'vuex'

  export default {
    name: 'DashboardChart',

    components: {
      ChartComponent: () => import('../component/ChartComponent')
    },

    data: () => ({
      loading: false,
      loadingCard: false,
      donePie: false,
      doneBar: false,
      customCharts: [],
      title: '',
      custom_data: null,
      total: 0,
      custom_id: '',
    }),

    async mounted () {
      await this.fetchCustomCharts()
    },

    computed: {
      ...mapState(['companyId']),

      pieChart () {
        return pieChart(this.title, this.custom_pie_data, this.total)
      },

      barChart () {
        return barchart(this.title, '', '#', this.custom_bar_data)
      },
    },

    methods: {
      async fetchCustomCharts () {
        this.loadingCard  = true
        try {
          const res = await Get(`admin/chart/${this.companyId}/readall`)
          this.customCharts = res.data
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
          const res = await Post('admin/chart/test', data)
          const chartType = item['type']
          if (chartType == 'Pie Chart') {
            this.custom_pie_data = res.data[chartType]
            this.donePie = true
          } else {
            this.doneBar = true
            this.custom_bar_data = res.data[chartType]
          }
          this.title = item.title
          this.total = res.total
        } catch (e){
          console.log(e)
        }  finally {
          this.loading = false
        }
      },
    }
  }
</script>
