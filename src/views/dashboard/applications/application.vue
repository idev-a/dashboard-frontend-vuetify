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
      </v-data-table>
    </base-material-card>

    <v-spacer class="mt-12"></v-spacer>

    <!-- Users for the each application -->
    <base-material-card
      v-if="user"
      color="success"
      inline
      :title="usersTitle"
      class="px-5 py-3"
    >
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
    </base-material-card>

    <!-- Application detail -->
    <base-material-card
      v-if="details"
      color="success"
      inline
      icon="mdi-application"
      :title="currentApp.application_name"
      class="px-5 py-3"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="4"
          sm="3"
        >
          <v-card>
            <v-card-title class="headline">No of Users</v-card-title>
            <v-card-subtitle>{{currentApp.no_users}}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="3"
        >
          <v-card>
            <v-card-title class="headline">Price</v-card-title>
            <v-card-subtitle>{{currentApp.price}}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="3"
        >
          <v-card>
            <v-card-title class="headline">SoC2</v-card-title>
            <v-card-subtitle>{{currentApp.soc2}}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="3"
        >
          <v-card>
            <v-card-title class="headline">Other</v-card-title>
            <v-card-subtitle>{{currentApp.other}}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="4"
          sm="3"
        >
          <v-card>
            <v-card-title class="headline">Application Risk</v-card-title>
            <v-card-subtitle>{{currentApp.risk}}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="3"
        >
          <v-card>
            <v-card-title class="headline">Login URL</v-card-title>
            <v-card-subtitle>{{currentApp.login_url}}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
          sm="3"
        >
          <v-card>
            <v-card-title class="headline">Owner</v-card-title>
            <v-card-subtitle>{{currentApp.Owner}}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          cols="12"
        >
          <v-card>
            <v-card-title class="headline">Purpose</v-card-title>
            <v-card-subtitle>{{currentApp.purpose}}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
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
          text: 'No User',
          value: 'no_user',
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
        axios(`${BASE_API}/api/users/${item.application_name}/${companyId}`, {
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
