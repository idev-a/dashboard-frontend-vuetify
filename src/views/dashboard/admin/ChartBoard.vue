<template>
  <v-container
    id="chart-board"
    fluid
    tag="section"
    >
      <v-card
        class="pa-5"
      >
        <v-card-title class="mb-4">
          Chart Board
          <v-spacer></v-spacer>
          <v-btn :loading="loading" :disabled="!runnable" @click="testChart" color="main" class="mr-3">Test Chart<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
          <v-btn :loading="loading" :disabled="tested != 'success'" @click="saveChart" color="main">Save Charts<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
          <v-btn :loading="loading" :disabled="loading" @click="readAll" color="main">Read All<v-icon  size="16" right dark>mdi-database</v-icon></v-btn>
        </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              >
              <v-card outlined>
                <v-card-title>
                <v-row
                >
                <v-col
                cols='12'
                md='4'
                >
                  <v-autocomplete
                    v-model="company"
                    :rules="[rules.required]"
                    chips
                    :items="companies"
                    class=""
                    label="Select a company"
                    hint="Select a company you want to get the chart data"
                    :error="error"
                    :error-messages="errorMessages"
                    @change="changeCompany"
                  />
                </v-col>
                <v-col
                cols='12'
                md='4'
                >
                  <v-autocomplete
                    v-model="chartType"
                    :rules="[rules.required]"
                    chips
                    :items="chartTypes"
                    class=""
                    label="Select a type for the chart"
                    hint="Select a proper type of chart you want"
                    :error="error"
                    :error-messages="errorMessages"
                  />
                </v-col>
                <v-col
                  v-if="false"
                  cols='12'
                  md='4'
                >
                  <v-autocomplete
                    v-model="chartGroup"
                    :rules="[rules.required]"
                    chips
                    :items="chartGroups"
                    class=""
                    label="Select a group"
                    hint="Select a group"
                    :error="error"
                    :error-messages="errorMessages"
                  />
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
          <v-card outlined>
            <v-card-title>
              <v-row>
                <v-col
                cols='12'
                md="8"
                >
                  <v-text-field
                    v-model="label"
                    prepend-icon="mdi-clipboard-text"
                    label="Label of select"
                    hint="The label appearing on the user side"
                    :rules="[rules.required]"
                    class="mx-3"
                  ></v-text-field>
                </v-col>
                <v-col
                cols='12'
                md='6'
                >
                  <v-text-field
                    v-model="title"
                    prepend-icon="mdi-clipboard-text"
                    label="Title of chart"
                    hint="Title of chart"
                    :rules="[rules.required]"
                    class="mx-3"
                  ></v-text-field>
                </v-col>
                <v-col
                cols='12'
                md="3"
                >
                  <v-autocomplete
                    v-model="targetTable"
                    :rules="[rules.required]"
                    chips
                    :items="tableNames"
                    class=""
                    label="Select a target table"
                    hint="Select a table you want change chart"
                  />
                </v-col>
                <v-col
                  v-if="false"
                  cols='12'
                  md='3'
                >
                  <v-text-field
                    v-model="company_id_field"
                    prepend-icon="mdi-clipboard-text"
                    label="Field name of company_id"
                    :hint="companyIdHint"
                    :rules="[rules.required]"
                    class="mx-3"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
          <v-row>
            <v-col cols="12">
              <card-list v-model="conditions" #default="{ item }">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="item.dataLabel"
                      :rules="[rules.required]"
                      prepend-icon="mdi-format-text"
                      label="What kind of data do you want to display (Data Label)"
                      hint="Data label appeared on the charts"
                      ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="item.condition"
                      :rules="[rules.required]"
                      prepend-icon="mdi-filter"
                      label="What kind of data do you want to display (Query Where Condition)"
                      hint="Input the query conditions as you want (Ctrl + Enter to run the test)"
                      rows="1"
                      auto-grow
                      @keyup.ctrl.13="keyDownOnTest"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </card-list>
            </v-col>
          </v-row>
        </v-form>
          <v-row>
            <v-col cols="auto" class="py-0 mx-auto">
              <v-btn @click="add" text>
                <v-icon>
                  mdi-plus
                </v-icon>
                Add Condition
              </v-btn>
            </v-col>
          </v-row>
          </v-card-text>
          <v-card outlined class="mt-0 mx-3">
            <v-card-title>
          Charts <small class="ml-2">(Results)</small>
        </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols='12'
                md="6"
                v-if="!loading && done" 
              >
                <v-sheet class="min-50">
                  <highcharts :options="barChart"></highcharts>
                </v-sheet>
              </v-col>
              <v-col
                cols='12'
                md="5"
                v-if="!loading && done && data['Pie Chart'] && data['Pie Chart'].length" 
                >
                  <v-sheet class="min-50">
                    <highcharts :options="pieChart"></highcharts>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card-text>
        </v-card>
        <v-card outlined class="mx-3">
          <v-card-title>
            Chart Data <small class="ml-2">(click to see the details)</small>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                class="mb-5 mr-3"
                hide-details
              ></v-text-field>
              <v-btn @click="deleteChartTableData" :disabled="selectedChartTableData.length == 0" text icon color="red">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-data-table
                v-model="selectedChartTableData"
                :loading="loading"
                :headers="headers"
                :items="chartTableData"
                :items-per-page="page"
                item-key="id"
                :search="search"
                show-select
                @update:items-per-page="getPageNum"
                  @click:row="showDetails"
              > 
                <template v-slot:item.conditions="{ item }">
                  <div v-for=" cond,x in item.conditions"><b>{{ x + 1 }}.</b> {{ cond.condition }}</div>
                </template>
            </v-data-table>
          </v-card-text>
        </v-card>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      bottom
      :color="color"
      >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
  import { BASE_API, fetchCompanies } from '../../../api'
  import { DOMAIN_LIST, downloadCSV, pieChart, barchart } from '../../../util'
  import axios from 'axios'
  import { mapState } from 'vuex'

    export default {
      name: 'ChartBoard',

      data: () => ({
        loading: false,
        search: '',
        valid: true,
        tab: null,
        done: false,
        modal: false,
        runnable: true,
        tested: 'failed',
        company: '',
        company_id_field: 'company_id',
        companies: [],
        defaultCompanies: [
          '627846.com',
          'grove.co',
          'revampcybersecurity.com'
        ],
        chartGroup: 'Default',
        chartGroups: [
          'Default',
        ],
        chartType: 'Pie Chart',
        chartTypes: [
          'Pie Chart',
          'Bar Chart'
        ],
        query: '',
        testquery: '',
        dataLabel: '',
        queryList: [],
        error: false,
        errorMessages: '',
        title: '',
        label: '',
        chartTableData: [],
        selectedChartTableData: [],
        targetTable: '',
        tableNames: [],
        data: [],
        total: 0,
        snackbar: false,
        message: '',
        color: 'success',
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
        },
        conditions: [
          {
            id: 1,
            dataLabel: '',
            condition: ''
          },
        ],
        counter: 10,
        headers: [
          {
            text: 'Type',
            value: 'type'
          },
          {
            text: 'Company',
            value: 'company'
          },
          {
            text: 'Title',
            value: 'title'
          },
          {
            text: 'Conditions',
            value: 'conditions'
          },
          {
            text: 'Table Name',
            value: 'target_table'
          },
        ]
      }),

      components: {
        CardList: () => import('../component/ConditionList'),
      },

      computed: {
        ...mapState(['page', 'companyId']),
        pieChart () {
          return pieChart(this.title, this.data['Pie Chart'], this.total)
        },

        barChart () {
          return barchart(this.title, `Total ${this.total}`, '#', this.data['Bar Chart'])
        },

        companyIdHint () {
          return 'The field name of table ' + this.targetTable + ' to represent comapany id'
        }
      },

      async mounted () {
        this.getTables()

        this.companies = await this.fetchCompanies()
      },

      methods: {
        fetchCompanies,

        getPageNum (_page) {
            localStorage.setItem('page', _page)
        },

        add () {
          this.conditions.push({ id: this.counter++ })
        },

        async deleteChartTableData () {
          const self = this
          await this.$dialog.confirm({
            text: 'Do you really want to delete data?',
            title: 'Warning',
            actions: {
              false: 'No',
              true: {
                color: 'red',
                text: 'Yes',
                handle: () => {
                  self._deleteChartTableData()
                }
              }
            }
          })
        },

        async _deleteChartTableData () {
          this.loading = true
          const ids = this.selectedChartTableData.map(item => item.id)
            try {
            const res = await axios({
                url: `${BASE_API}/api/admin/chart/delete`,
                method: 'POST',
                data: { ids }
              })
              this.chartTableData = this.chartTableData.filter(item => !ids.includes(item.id))
              this.message = res.data.message
              this.color = res.data.status
          } catch(e) {
            this.message = e.response.data.message
          } finally {
              this.loading = false
              this.snackbar = true
          }
        },

        showDetails (item) {
          this.title = item.title
          this.chartType = item.type
          this.chartGroup = item.group
          this.label = item.label
          this.conditions = item.conditions
          this.targetTable = item.target_table
          this.company = item.company
          this.company_id_field = item.company_id_field

          this.done = false
        },
        async getTables () {
          const query = 'Show Tables'
          try {
            const res = await axios({
              url: `${BASE_API}/api/admin/query`,
              data: { query },
              method: 'POST'
            })
            this.tableNames = res.data.items.map(item => { return item.Tables_in_revamp })
          } catch(e) {
            console.log(e)
          } finally {
              this.loading = false
          }
        },

        async readAll () {
          this.loading = true
          try {
            const res = await axios({
                url: `${BASE_API}/api/admin/chart/${this.companyId}/readall`,
                method: 'GET'
              })
              this.chartTableData = res.data.data
              this.message = res.data.message
              this.color = res.data.status
          } catch(e) {
            this.message = e.response.data.message
          } finally {
              this.loading = false
              this.snackbar = true
          }
        },

        keyDownOnTest () {
          this.testChart()
        },

        async saveChart () {
          this.$refs.form.validate()

          if (!this.valid) { 
            return
          }

          this.loading = true
          // this.headers = []
          const data =  { 
            company_id_field: this.company_id_field,
            targetTable: this.targetTable,
            conditions: this.conditions,
            chartType: this.chartType,
            dataLabel: this.dataLabel,
            company: this.company,
            label: this.label,
            title: this.title
          }

          try {
            const res = await axios({
                url: `${BASE_API}/api/admin/chart/save`,
                data,
                method: 'POST'
              })
              this.message = res.data.message
              this.color = res.data.status
          } catch(e) {
            this.message = e.response.data.message
          } finally {
            this.loading = false
            this.snackbar = true
            this.done = true
          }
        },

        async testChart () {
          this.$refs.form.validate()

          if (!this.valid) { 
            return
          }

          this.loading = true
          const data =  { 
            company_id_field: this.company_id_field,
            targetTable: this.targetTable,
            conditions: this.conditions,
            chartType: this.chartType,
            company: this.company,
          }
          try {
            const res = await axios({
                url: `${BASE_API}/api/admin/chart/test`,
                data,
                method: 'POST'
              })
              this.data = res.data.data
              this.total = res.data.total
              this.message = res.data.message
              this.tested = res.data.status
              this.color = res.data.status
          } catch(e) {
            this.message = e.response.data.message
          } finally {
              this.loading = false
              this.snackbar = true
              this.done = true
          }
        },
        changeCompany () {
          this.conditions = [
            {
              id: 1,
              dataLabel: '',
              condition: ''
            },
          ]
          this.targetTable = ''
          this.chartType = 'Pie Chart'
          this.title = ''
          this.label = ''
        }
    }
  }
</script>