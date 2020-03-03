<template>
  <v-container
    id="high-risks"
    fluid
    tag="section"
  >
    <!-- Applications to each company -->
    <base-material-card
      color="success"
      inline
      title="Applications"
      class="px-5 py-3"
    >
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
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="appHeaders"
        :items="apps"
        :items-per-page="5"
        item-key="id"
        :search="search"
        single-expand
        show-expand
        :expanded.sync="expanded"
      >
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click="showUsers(item)"
              >
                <v-icon>mdi-account-search</v-icon>
              </v-btn>
            </template>
            <span>Show Users</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click="showDetails(item)"
              >
                <v-icon>mdi-application</v-icon>
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
          <td :colspan="headers.length">
            <!-- Users for the each application -->
            <v-card
              v-if="user"
              class="px-5 py-3"
            >
              <v-card-title
              >
                <span
                  class="font-weight-bold"
                >
                  {{usersTitle}}
                </span>
              </v-card-title>
              <v-card-title>
                <v-text-field
                  v-model="searchUser"
                  append-icon="mdi-magnify"
                  label="Search"
                  class="mb-3"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                :loading="loading"
                :headers="userHeaders"
                :items="users"
                :items-per-page="5"
                item-key="id"
                :search="searchUser"
              >
                <template v-slot:item.has_2fa="{ item }">
                  <v-chip :color="item.has_2fa == 1 ? 'success' : 'default'" dark>{{ item.has_2fa == 1 ? 'Yes' : 'No' }}</v-chip>
                </template>
              </v-data-table>
            </v-card>

            <!-- Application detail -->
            <v-card
              v-if="details"
              class="px-5 py-3"
            >
               <v-card-title
              >
                <span
                  class="font-weight-bold"
                >
                  {{currentApp.application_name}}
                </span>
              </v-card-title>
              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">No of Users</div>
                    <span>{{currentApp.no_users}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Price</div>
                    <span>{{currentApp.price}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">SoC2</div>
                    <span>{{currentApp.soc2}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Other</div>
                    <span>{{currentApp.other}}</span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Application Risk</div>
                    <span>{{currentApp.risk}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Login URL</div>
                    <span>{{currentApp.login_url}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Owner</div>
                    <span>{{currentApp.Owner}}</span>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="6"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Purpose</div>
                    <span>{{currentApp.purpose}}</span>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </td>
        </template>
      </v-data-table>
    </base-material-card>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { BASE_API } from '../../../api'
  import axios from 'axios'

  export default {
    name: 'DashboardApplications',

    data: () => ({
      loading: false,
      search: '',
      searchUser: '',
      snack: false,
      snackColor: '',
      snackText: '',
      currentApp: '',
      user: false,
      details: false,
      pagination: {},
      appHeaders: [
        {
          text: 'Name',
          value: 'application_name',
        },
        {
          text: 'Purpose',
          value: 'purpose',
        },
        {
          text: 'Risk',
          value: 'risk',
        },
        {
          text: 'SOC2',
          value: 'soc2',
        },
        {
          text: 'Admin User',
          value: 'admin_user',
        },
         {
          text: 'No Users',
          value: 'no_users',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      apps: [],
      userHeaders: [
        {
          text: 'Name',
          value: 'fullname',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Status',
          value: 'status',
        },
        {
          text: '2FA',
          value: 'has_2fa',
        },
      ],
      users: [],
      expanded: [],
    }),

    mounted () {
      this.fetchRisks()
    },

    computed: {
      usersTitle () {
        if (this.currentApp) {
          return `Users (${this.currentApp.application_name})`
        } else {
          return 'Users'
        }
      }
    },

    methods: {
      showDetails (item) {
        this.currentApp = item
        this.details = true
        this.user = false
        this.expanded = []
        this.expanded.push(item)
      },
      showUsers (item) {
        this.currentApp = item
        this.user = true
        this.details = false
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        self.expanded = []
        axios(`${BASE_API}/api/users/${item.application_name}/${companyId}`, {
            method: 'GET',
          })
            .then(function (res) {
              self.users = res.data.users
              self.expanded.push(item)
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },
      fetchRisks () {
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/applications/all/${companyId}`, {
            method: 'GET',
          })
            .then(function (res) {
              self.apps = res.data.apps
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },
    }
  }
</script>
