<template>
  <v-container
    id="random-data"
    fluid
    tag="section"
    >
      <v-card
        class="pa-5"
      >
        <v-card-title>
          <div>
            Random Board
          </div>
          <v-spacer></v-spacer>
          <v-btn :loading="loading" :disabled="loading || !this.valid" @click="generateData" color="main">Generate<v-icon right size="16" dark>mdi-send</v-icon></v-btn>
          <v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="saveData" color="main">Save<v-icon right size="16" dark>mdi-database</v-icon></v-btn>
          <v-btn v-if="false" :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main"><v-icon  size="16" dark>mdi-download</v-icon></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form 
          ref="inputForm"
          v-model="valid"
        > 
          <v-row>
            <v-col
              cols='12'
              sm="6"
              md="2"
              >
                <v-select
                  v-model="form.company_id"
                  :items="companies"
                  :rules="[rules.required]"
                  label="Company"
                  chips
                  @change="changeCompany"
                >
                </v-select>
              </v-col>
              <v-col
                cols='12'
                sm="6"
                md="3"
              >
                <v-select
                  v-model="table"
                  label="Table"
                  :items="tables"
                  :disabled="loading || !items.length"
                  chips
                  @change="changeTable"
                ></v-select>
              </v-col>
              <v-col
                cols='12'
                sm="6"
                md="2"
              >
                <v-text-field
                  v-model="form.userCnt"
                  type="number"
                  :rules="[rules.required, rules.min1]"
                  label="# of Users"
                ></v-text-field>
              </v-col>
              <v-col
                cols='12'
                sm="6"
                md="2"
              >
                <v-text-field
                  v-model="form.groupCnt"
                  type="number"
                  :rules="[rules.required, rules.min1]"
                  label="# of Groups"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-dialog
                  ref="menu"
                  v-model="menu"
                  :return-value.sync="selectedDates"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="computedDateFormatted"
                      label="Select Date Range"
                      readonly
                      v-on="on"
                    >
                      <v-icon slot="prepend" @click="menu = true">mdi-calendar</v-icon>
                    </v-text-field>
                  </template>
                    <v-date-picker v-model="selectedDates" range scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="secondary" @click="menu = false">Cancel</v-btn>
                      <v-btn text color="primary" :disabled="selectedDates.length==1" @click="filterRange(selectedDates)">OK</v-btn>
                    </v-date-picker>
                </v-dialog>
              </v-col>
          </v-row>
        </v-form>
        
        <v-spacer />

        <v-data-table
          v-model="selectedItems"
          :loading="loading"
          :headers="headers"
          :items="items"
          fixed-header
          :items-per-page="page"
          item-key="id"
          :search="search"
          show-select
          @update:items-per-page="getPageNum"
        >
          <template v-slot:item.email="{ item }">
            <span v-html="beautifyEmails(item.email)"></span>
          </template> 
          <template v-slot:item.member_emails="{ item }">
            <span v-html="beautifyEmails(item.member_emails.join(','))"></span>
          </template> 
        </v-data-table>
      </v-card-text>
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
  import { 
    BASE_API,
    getCompaniesUsers,
    fetchTables,
    fetchAllApps,
    fetchAllQuestions,
    fetchDevices,
    Get,
    Post
  } from '@/api'
  import { downloadCSV, beautifyEmails } from '@/util'
  import { generateData } from '@/fake'
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'RandomBoard',

    data () {
      return {
        valid: true,
        loading: false,
        menu: false,
        startDate: '2020-01-01',
        endDate: '2020-12-31',
        selectedDates: [],
        search: '',
        items: [],
        data: {
          users: [],
          general_bamboo: [],
          google_groups: [],
          company_applications: [],
          security_answers: [],
          gsuite_devices: []
        },
        selectedItems: [],
        form: {
          company_id: '',
          userCnt: 10,
          groupCnt: 10,
        },
        companies: [],
        table: '',
        tables: [
          'users',
          'general_bamboo',
          'google_groups',
          'company_applications',
          'security_answers',
          'gsuite_devices'
        ],
        apps: [],
        users: [],
        questions: [],
        devices: [],
        saved: false,
        message: '',
        snackbar: false,
        color: 'success',
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
          min1: value => {
            return value > 1 || 'Must be greater than 1'
          }
        }
      }
    },

    computed: {
      ...mapState(['page']),

      headers () {
        let headers = []
        if (this.items.length) {
          Object.keys(this.items[0]).map(item => {
            if (!['id', 'question_id', 'application_id', 'primaryEmail', 'name', 'link', 'tag', 'Notes', 'company', 'gsuite_admin', 'user_type', 'observations', 'notes', 'resourceId', 'deviceId', 'hardwareId', 'useragent'].includes(item)) {
              const header = {
                  text: item.toUpperCase(),
                  value: item
                }
              if (item == 'description') {
                header.width = 300
              } 
              if (item == 'answer') {
                header.width = 100
              } 
              if (item === 'question') {
                header.width = 200
              } 
              headers.push(header)
            } 
          })
        }
        return headers
      },

      computedDateFormatted () {
        if (this.selectedDates.length) {
          return this.selectedDates[0] + ' ~ ' + this.selectedDates[1]
        } else {
          return `${this.startDate} ~ ${this.endDate}`
        }
      }
    },

    async mounted () {
      this.companies = await getCompaniesUsers()

      this.apps = await fetchAllApps()
      this.questions = await fetchAllQuestions()
      this.devices = await fetchDevices()
    },

    methods: {
      beautifyEmails,

      filterRange (date) {
        this.$refs.menu.save(date)
        this.startDate = date[0]
        this.endDate = date[1]
      },

      downloadCSV () {
        if (this.selectedItems.length) {
          downloadCSV(this.selectedItems)
        } else {
          downloadCSV(this.items)
        }
      },
        
      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      async fetchAndSetTables () {
        let tables = await fetchTables()
        const whiteListTables = ['security_answers', 'google_groups', 'general_bamboo', 'users', 'groups']
        tables.map(table => {
          if (whiteListTables.includes(table) || table.endsWith('_users')) {
            this.tables.push(table)
          }
        })
      },

      generateData () {
        this.$refs.inputForm.validate()
        if (!this.valid) {
          return
        }
        this.loading = true
        const res = generateData({
          ...this.form,
          apps:this.apps,
          questions: this.questions,
          devices: this.devices,
          startDate: this.startDate,
          endDate: this.endDate
        })
        this.items = res.users
        this.data = res
        this.table = 'users'
        this.saved = false
        this.loading = false
      },

      async saveData () {
        this.loading = true
        try {
          const res = await Post(`admin/random/save`, this.data)
          this.message = res.message
          this.color = res.status
        } catch(e) {
          this.message = 'Something wrong happened on the server.'
        } finally {
          this.loading = false
          this.snackbar = true
        }
      },

      changeTable () {
        this.items = this.data[this.table]
      },

      changeCompany () {
        this.items = []
        this.selectedItems = []
        this.data = {}
        this.saved = false
      },
    }
  }
</script>