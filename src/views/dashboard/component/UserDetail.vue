<template>
  <div>
    <div
      color="success"
      class="px-3 py-1"
    >
        <!-- <v-card-title>
          {{ currentUser.firstname_lastname }}
        </v-card-title> -->
        <v-row>
          <v-col
            cols="12"
            sm="3"
            md="3"
          >
            <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <b class="display-1">Email</b>
            <div class="text--secondary" v-html="beautifyEmail(currentUser.email)"></div>
            <!-- </v-card> -->
          </v-col>
          <v-col
            cols="12"
            sm="3"
            md="3"
          >
              <b class="display-1">Full name</b>
              <div class="text--secondary">{{currentUser.firstname_lastname}}</div>
          </v-col>
          <v-col
            cols="12"
            sm="3"
            md="3"
          >
              <b class="display-1">Department</b>
              <div class="text--secondary">{{currentUser.department}}</div>
          </v-col>
          <v-col
            cols="12"
            sm="3"
            md="3"
          >
            <!-- <v-card shaped outlined class="my-0 pa-2"> -->
              <b class="display-1 d-block">Privileged</b>
              <v-chip :color="currentUser.privileged_account == 1 ? 'success' : 'default'" dark><div class="subtitle-2">{{ currentUser.privileged_account == 1 ? 'Yes' : 'No' }}</div></v-chip>
            <!-- </v-card> -->
          </v-col>
          <v-col
            cols="12"
            sm="3"
            md="3"
          >
            <!-- <v-card shaped outlined class="my-0 pa-2"> -->
              <b class="display-1 d-block">Active</b>
              <v-chip :color="currentUser.email_not_active == 1 ? 'success' : 'default'" dark><div class="subtitle-2">{{ currentUser.email_not_active == 1 ? 'Yes' : 'No' }}</div></v-chip>
            <!-- </v-card> -->
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="3"
          >
            <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
              <b class="display-1 d-block">Individual Risk</b>
              <v-chip :color="levelColor(currentUser.risk_level)" dark><div class="subtitle-2">{{ currentUser.risk_level ? currentUser.risk_level : 'low' }}</div></v-chip>
            <!-- </v-card> -->
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="3"
          >
            <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
              <b class="display-1">Type</b>
              <div class="text--secondary">{{currentUser.user_type}}</div>
            <!-- </v-card> -->
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="3"
          >
              <b class="display-1">Location</b>
              <div class="text--secondary">{{ currentUser.location }}</div>
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="3"
          >
            <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
              <b class="display-1">Job Title</b>
              <div class="text--secondary">{{currentUser.job_title}}</div>
            <!-- </v-card> -->
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="6"
          >
            <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
              <b class="display-1">Observations</b>
              <div class="text--secondary">{{currentUser.observations}}</div>
            <!-- </v-card> -->
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="6"
          >
            <b class="display-1">Notes</b>
            <div class="text--secondary" v-html="highlightText(currentUser.notes)"></div>
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="6"
          >
            <b class="display-1">Company</b>
            <div class="text--secondary">{{currentUser.company_id}}</div>
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="6"
          >
            <div class="display-1 mb-2">Mobile Devices</div>
            <v-btn outlined rounded small @click="showMobileDevices">Show Devices</v-btn>
          </v-col>
          <v-col
            cols="9"
          >
            <b class="display-1">Applications</b>
            <div class="d-flex flex-wrap text--secondary"><v-chip v-for="app in currentUser.apps" class="ma-2"><span class="subtitle-1">{{app.name}}</span></v-chip></div>
          </v-col>
        </v-row>
      </div>

      <v-dialog
        v-model="deviceDialog"
      >
        <v-card
        >
          <div class="d-flex py-3 px-5 align-center">
            <div class="display-1 ml-4">Mobile Devices ({{ currentUser.email }})</div>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="deviceSearch"
              append-icon="mdi-magnify"
              label="Search"
              class="mb-5 mr-3"
              single-line
              hide-details
            ></v-text-field>
            <v-btn @click="deviceDialog = false" icon><v-icon>mdi-close</v-icon></v-btn>
          </div>
          <v-card-text>
            <v-data-table
              v-model="selectedDevices"
              :loading="loading"
              :headers="deviceHeaders"
              :items="devices"
              :items-per-page="page"
              item-key="id"
              :search="deviceSearch"
              show-select
              @update:items-per-page="getPageNum"
            > 
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
  import { BASE_API, Get, Post } from '@/api'
  import { levelColor, beautifyEmail, highlightText } from '@/util'
  import { mapState } from 'vuex'

  export default {
    name: 'UserDetail',

    props: {
      currentUser: {
        type: Object
      }
    },

    computed: {
      ...mapState(['page', 'companyId']),
    },

    data () {
      return {
        loading: false,
        deviceSearch: '',
        devices: [],
        selectedDevices: [],
        deviceDialog: false,
        deviceHeaders: [
          {
            text: 'Device Id',
            value: 'deviceId'
          },
          {
            text: 'Model',
            value: 'model'
          },
          {
            text: 'OS',
            value: 'os'
          },
          {
            text: 'Type',
            value: 'type'
          },
          {
            text: 'Status',
            value: 'status'
          },
          // {
          //   text: 'Hardware Id',
          //   value: 'hardwareId'
          // },
          {
            text: 'First Sync',
            value: 'firstsync'
          },
          {
            text: 'Last Sync',
            value: 'lastsync'
          },
          // {
          //   text: 'User Agent',
          //   value: 'useragent'
          // },
        ],
        snackbar: false,
        color: '',
        message: '',
      }
    },

    methods: {
      beautifyEmail,
      levelColor,
      highlightText,

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      async showMobileDevices () {
        this.loading = true
        this.devices = []
        this.deviceDialog = true
        this.selectdDevices = []
        try {
          const res = await Get(`admin/gsuite/mobile/${this.currentUser.email}`)
          this.devices = res.items
          this.message = res.message
          this.color = res.status
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