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
            <v-row>
              <v-col
                cols='auto'
              >
                <v-select
                  v-model="custom_id"
                  :loading="loadingCard"
                  :items="customCharts"
                  item-value="id"
                  item-text="title"
                  return-object
                  label="Select a custom chart"
                  hint="Select a custom chart"
                  @input="selectCustomChart"
                ></v-select>
              </v-col>
            </v-row>
            <div v-if="series.length">
              <highcharts :options="columnChart"></highcharts>
            </div>
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
    barchart,
    columnChart
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
      series: [],
      categories: []
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
      columnChart () {
        return columnChart(this.title, '', 'Counts', this.series, this.categories, this.chartType)
      },
    },

    methods: {
      async fetchCustomCharts () {
        this.loadingCard  = true
        try {
          const res = await Get(`admin/chart/read/new`)
          this.customCharts = res.items
        } catch (e){
          console.log(e)
        }  finally {
          this.loadingCard = false
        }
      },

      async selectCustomChart (item) {
        this.loading = true
        this.donePie = false
        this.doneBar = false
        this.loading = true
        const res = await Post('admin/chart/change-field', {
          company_id: this.companyId,
          table: item.table,
          tableField: item.table_field,
          breakdownField: item.breakdown_field,
          chartType: item.chart_type,
          topCnts: item.pieces_cnt
        })
        if (res.status == 'success') {
          this.chartType = item.chart_type
          this.series = res.series
          this.categories = res.categories
        }
        this.loading = false
      },
    }
  }
</script>
