<template>
  <v-container
      id="meraki-board"
      fluid
      tag="section"
    >
      <v-card
        class="pa-5"
      >
        <v-card-title>
            Meraki Board
            <v-spacer></v-spacer>
            <v-select
              v-model="endpoint"
            chips
              :items="endpoints"
              class="mr-5 max-width-300"
              label="Select an endpoint"
              hint="Select an endpoint that you want to fetch from meraki"
              :error="error"
              :error-messages="errorMessages"
              @input="changeEndpoint"
            ></v-select>
            <v-btn :loading="loading" :disabled="!runnable" @click="runAPI" color="main">Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
            <v-btn :loading="loading" :disabled="loading || !items.length" @click="items = []" color="main">Refresh <v-icon  size="16" right dark>mdi-refresh</v-icon></v-btn>
          </v-card-title>
          <v-card-text>
            <v-row
          >
            <v-col
            cols='12'
            md="5"
            >
            <v-text-field
              v-model="apiKey"
              :loading="loading"
              hide-details="auto"
              class="mb-2"
              label="Please enter api key"
              prepend-icon="mdi-key"
              @input="changeInput"
            />
            </v-col>
            <v-col
            cols='12'
            md="5"
            >
            <v-text-field
              v-model="orgId"
              :loading="loading"
              hide-details="auto"
              class="mb-2"
              label="please enter Org Id"
              prepend-icon="mdi-identifier"
              @input="changeInput"
            />
            </v-col>
          </v-row>
          <v-row>
            <v-col
            cols='12'
            md="5"
            >
              <v-textarea
                v-model="networkId"
                :loading="loading"
                class="max-height-300"
                label="Please enter network Id(s)"
                hint="A list of network ids seperated by new line"
                rows="3"
                outlined
                @input="changeInput"
              />
            </v-col>
            <v-col
            cols='12'
            md="5"
            >
              <v-textarea
                v-model="deviceId"
                :loading="loading"
                class="max-height-300"
                label="Please enter device Id(s)"
                hint="A list of device ids seperated by new line"
                rows="3"
                outlined
                @input="changeInput"
              />
            </v-col>
          </v-row>
          </v-card-text>

          <v-spacer></v-spacer>

          <v-card-title>
            Results ({{ endpoint.toUpperCase() }})
          </v-card-title>
          <v-card-title>
          <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  class="mb-5"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-btn :loading="loading" :disabled="loading || !endpoint || !orgId" @click="readAll" color="main">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
                  </template>
                  <span>Read Meraki Devices Data from Database</span>
                </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="populateData" color="main">Populate <v-icon  size="16" right dark>mdi-database-export</v-icon></v-btn>
                  </template>
                  <span>Populate Data from API into Database</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
                  </template>
                  <span>Download Data as CSV</span>
                </v-tooltip>
            </v-card-title>
          <v-data-table
          v-model="selectedItems"
            :loading="loading"
            :headers="headers"
            :items="indexedItems"
            :items-per-page="page"
            item-key="_id"
            :search="search"
            show-select
            @update:items-per-page="getPageNum"
          > 
        </v-data-table>
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
  import { BASE_API } from '../../../api'
  import { downloadCSV } from '../../../util'
  import axios from 'axios'

    export default {
      name: 'MerakiBoard',

      data: () => ({
        loading: false,
        modal: false,
        tooltip: true,
        search: '',
        error: false,
        errorMessages: '', 
        orgId: '980328',
        networkId: '',
        networkIds: [],
        deviceId: '',
        deviceIds: [],
        apiKey: 'd5e95468c483102bec4de6cb9afed4b79b5e0568',
        headers: [
        ],
        selectedItems: [
        ],
        items: [
        ],
        endpoint: '',
        endpoints: [
          {text: 'devices', value: 'devices'},
          {text: 'clients', value: 'clients'},
          {text: 'sm devices', value: 'sm/devices'},
          {text: 'sm devices software', value: 'sm/devices/software'},
        ],
        snackbar: false,
        message: '',
        color: 'failure',
        runnable: false,
        }),

        watch: {
          selectedItems () {
            if (this.selectedItems.length > 0) {
              const _endpoint = this.endpoint
              this.selectedItems.map(item => {
                if (item.networkId) {
                  this.endpoint = 'clients'
                } else {
                  this.endpoint = _endpoint
                }
              })
              this.changeInput('')
            } 
          }
        },

        computed: {
          page () {
            return Number(localStorage.getItem('page')) || 5
          }, 

          indexedItems () {
            return this.items.map((item, index) => ({
              _id: index,
              ...item
            }))
          },
        },

        methods: {
          getPageNum (_page) {
            localStorage.setItem('page', _page)
        },

        buildNetworkIds () {
          let networkIds = []
          if (this.selectedItems.length > 0 && this.selectedItems[0].networkId) {
            this.selectedItems.map(item => {
              if (item.networkId) {
                networkIds.push(item.networkId.trim())
              }
            })
          }
          if (this.networkId) {
            this.networkId.split('\n').map(_networkId => {
              if (!networkIds.includes(_networkId.trim())) {
                networkIds.push(_networkId.trim())
              }
            })
          }
          this.networkIds = networkIds
        },

        buildDeviceIds() {
          let deviceIds = []
          if (this.selectedItems.length > 0 && this.selectedItems[0].deviceId) {
            this.selectedItems.map(item => {
              if (item.deviceId) {
                deviceIds.push(item.deviceId.trim())
              }
            })
          }
          if (this.deviceId) {
            this.deviceId.split('\n').map(_deviceId => {
              if (!deviceIds.includes(_deviceId.trim())) {
                deviceIds.push(_deviceId.trim())
              }
            })
          }
          this.deviceIds = deviceIds
        },

        changeEndpoint (val) {
          this.endpoint = val
          this.changeInput()
        },

        changeInput (val) {
          this.error = false
          this.errorMessages = ''
          if ( ['clients', 'sm/devices'].includes(this.endpoint)) {
            this.buildNetworkIds()
          } 
          if (this.endpoint == 'sm/devices/software') {
            this.buildDeviceIds()
          }
          if (!this.loading && this.apiKey && this.orgId && this.endpoint) {
            this.runnable = true
          } else {
            this.runnable = false
            this.error = true
            this.errorMessages = 'Please input an api key and org id'
          }
        },

        parseHeader (items) {
        if (items.length) {
          let _headers = []
              Object.keys(items[0]).map((val,i) => {
                _headers.push({
                  text: val[0].toUpperCase() + val.slice(1),
                  value: val
                })
              })
              this.headers = _headers
            }
        },

          async runAPI () {
            this.loading = true
            this.selectedItems = []
            this.items = []

            const data = { 
              apiKey: this.apiKey, 
              orgId: this.orgId, 
              networkIds: this.networkIds,
              deviceIds: this.deviceIds
            }
          try {
            const res = await axios({
                url: `${BASE_API}/api/admin/meraki/${this.endpoint}`,
                data,
                method: 'POST'
              })
              this.items = res.data.data.map((item, index) => {
                if (Object.keys(item).includes('org_id')) { 
                  return {
                    ...item,
                    run_at: this.$moment().format('YYYY-MM-DD HH:mm:ss')
                  }
                } else {
                  return {
                    ...item,
                    org_id: this.orgId,
                    run_at: this.$moment().format('YYYY-MM-DD HH:mm:ss')
                  }
                }
              })
              this.parseHeader(this.items)
              this.message = res.data.message
              this.color = res.data.status
              this.modal = true
          } catch(e) {
            if (e.response && e.response.data) {
              this.message = e.response.data.message  
            } else {
              this.message = 'Something wrong happened on the server.'
            }
          } finally {
              this.loading = false
              this.snackbar = true
          }
          },

          downloadCSV () {
            if (this.selectedItems.length) {
              downloadCSV(this.selectedItems)
            } else {
              downloadCSV(this.items)
            }
          },

          async populateData () {
            this.loading = true
            let data = this.indexedItems
            if (this.selectedItems.length) {
              data = this.selectedItems
            }
          try {
            const res = await axios({
                url: `${BASE_API}/api/admin/meraki/${this.endpoint}/populate`,
                data: { data },
                method: 'POST'
              })
              this.message = res.data.message
              this.color = res.data.status
              this.modal = true
          } catch(e) {
            this.message = e.response.data.message || 'Something wrong happened on the server.'
          } finally {
              this.loading = false
              this.snackbar = true
          }
          },

          async readAll () {
            this.loading = true
            this.items = []
            this.selectedItems = []
            
          try {
            const res = await axios({
                url: `${BASE_API}/api/admin/meraki/${this.endpoint}/read`,
                data: { org_id: this.orgId },
                method: 'POST'
              })
              this.items = res.data.data
              this.parseHeader(this.items)
              this.message = res.data.message
              this.color = res.data.status
          } catch(e) {
            this.message = 'Something wrong happened on the server.'
          } finally {
              this.loading = false
              this.snackbar = true
          }
          }
        }
  }
</script>
