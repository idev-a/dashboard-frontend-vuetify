<template>
  <v-container
    id="company-users"
    fluid
    tag="section"
  >
    <v-card
      icon="mdi-account-multiple"
      title="Users"
      class="px-5 py-3"
    >
      <v-card-title>
        Users
        
      </v-card-title>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-3"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          v-model="filteredRisks"
          :items="risks"
          multiple
          class="max-100"
          label="Risk Level"
          chips
          deletable-chips
        >
        </v-select>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="filteredUsers"
        item-key="email"
        :items-per-page="page"
        :search="search"
        single-expand
        @click:row="showDetails"
        :expanded.sync="expanded"
        @update:items-per-page="getPageNum"
      >
        <template v-slot:item.email="{ item }">
          <span v-html="beautifyEmail(item.email)"></span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="showDetails(item)"
              >
                <v-icon>mdi-account-search</v-icon>
              </v-btn>
            </template>
            <span>Show Details</span>
          </v-tooltip>
        </template>
        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
          <v-btn @click="expand(true)" v-if="item.canExpand && !isExpanded">Expand</v-btn>
          <v-btn @click="expand(false)" v-if="item.canExpand && isExpanded">close</v-btn>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" >
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
                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
                    <b class="display-1">Department</b>
                    <div class="text--secondary">{{currentUser.department}}</div>
                  <!-- </v-card> -->
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
              </v-row>
              <v-row>
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
                  <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
                    <b class="display-1">Location</b>
                    <div class="text--secondary">{{currentUser.location ? currentUser.location.replace('/', '') : ''}}</div>
                  <!-- </v-card> -->
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
              </v-row>
               <v-row>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
                    <b class="display-1">Observations</b>
                    <div class="text--secondary">{{currentUser.observations}}</div>
                  <!-- </v-card> -->
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <b class="display-1">Notes</b>
                  <div class="text--secondary">{{currentUser.notes}}</div>
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
                  <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
                    <b class="display-1">Applications</b>
                    <div class="d-flex flex-wrap text--secondary"><v-chip v-for="app in currentUser.apps" class="ma-2"><span class="subtitle-1">{{app.name}}</span></v-chip></div>
                  <!-- </v-card> -->
                </v-col>
              </v-row>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar bottom v-model="snackbar" :timeout="3000" :color="color">
      {{ message }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
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
  </v-container>
</template>

<script>
  import { BASE_API } from '../../../api'
  import { validEmail, levelColor } from '../../../util'
  import axios from 'axios'

  export default {
    name: 'DashboardCompanyUsers',

    data: () => ({
      loading: false,
      search: '',
      deviceSearch: '',
      deviceDialog: false,
      snackbar: false,
      color: '',
      message: '',
      currentUser: '',
      singleExpand: true,
      expanded: [],
      risks: [
        'High',
        'Medium',
        'Low'
      ],
      filteredRisks:['High'], 
      actions: [
        {
          color: 'info',
          icon: 'mdi-account',
        },
        {
          color: 'success',
          icon: 'mdi-pencil',
        },
        {
          color: 'error',
          icon: 'mdi-close',
        },
      ],
      headers: [
        {
          text: 'Full Name',
          value: 'firstname_lastname',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Job Title',
          value: 'job_title',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      users: [],
      devices: [],
      selectedDevices: [],
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
        {
          text: 'Hardware Id',
          value: 'hardwareId'
        },
        {
          text: 'First Sync',
          value: 'firstsync'
        },
        {
          text: 'Last Sync',
          value: 'lastsync'
        },
        {
          text: 'User Agent',
          value: 'useragent'
        },
      ]
    }),

    mounted () {
      this.fetchUsers()
    },

    computed: {
      page () {
        return Number(localStorage.getItem('page')) || 5
      }, 
      filteredUsers () {
        return this.users.filter(user => {
          if (this.filteredRisks.length == 0) {
            return user
          } else {
            let pattern = user.risk_level || 'low'
            if (pattern == 'medium') {
              pattern = /medium/i
            } else if (pattern == 'high') {
              pattern = /high/i
            } else {
              pattern = /low/i
            }
            const risks = this.filteredRisks.join('')
            if (risks.match(pattern)) {
              return user
            }
          }
        })
      }
    },

    methods: {
      levelColor,

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      beautifyApps (apps) {
        let appList = ''
        apps.map(app => {

        })
      },

      beautifyEmail (email) {
        if (validEmail(email)) {
          return `<a href="mailto:${email}">${email}</a>`
        } else {
          return email
        }
      },
      showDetails (item) {
        this.currentUser = item
        // this.user = true
        this.expanded = []
        this.expanded.push(item)
      },
      fetchUsers () {
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/users/${companyId}/all`, {
            method: 'GET',
          })
            .then(function (res) {
              self.users = res.data.users
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },

      async showMobileDevices () {
        this.loading = true
        this.devices = []
        this.deviceDialog = true
        this.selectdDevices = []
        try {
          const res = await axios.get(`${BASE_API}/api/admin/gsuite/mobile/${this.currentUser.email}`)
          this.devices = res.data.items
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
<style scoped>
.max-100 {
  max-width: 300px;
}
</style>