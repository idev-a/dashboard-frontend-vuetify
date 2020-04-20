<template>
  <v-container
    id="high-risks"
    fluid
    tag="section"
  >
    <!-- Applications to each company -->
    <v-card
      inline
      icon="mdi-alert-outline"
      title="Application Risk"
      class="px-5 py-3"
    >
      <v-card-title>
        Application Risk
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
      </v-card-title>
      <v-data-table
        v-if="apps.length > 0"
        :loading="loading"
        :headers="appHeaders"
        :items="apps"
        :items-per-page="page"
        item-key="id"
        :search="search"
        single-expand
        show-expand
        :expanded.sync="expanded"
        @update:items-per-page="getPageNum"
      >
        <template v-slot:item.risk="{ item }">
          <v-chip :color="levelColor(item.risk)" dark>
            <div class="subtitle-2">{{ item.risk ? item.risk : 'low' }}</div>
          </v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="showUsers(item)"
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
            <div
              v-if="user"
              class="px-4 py-1"
            >
              <v-card-title
              >
                <span
                  class="display-1"
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
                :items-per-page="page"
                item-key="id"
                :search="searchUser"
              >
                <template v-slot:item.email="{ item }">
                  <span v-html="beautifyEmail(item.email)"></span>
                </template>
                <template v-slot:item.has_2fa="{ item }">
                  <v-chip :color="item.has_2fa == 1 ? 'success' : 'default'" dark>{{ item.has_2fa == 1 ? 'Yes' : 'No' }}</v-chip>
                </template>
              </v-data-table>
            </div>

            <!-- Application detail -->
            <div
              v-if="details"
              class="px-4 py-1"
            >
              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                    <b class="display-1">No of Users</b>
                    <div class="text--secondary">{{currentApp.no_users}}</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                    <b class="display-1">Price</b>
                    <div class="text--secondary">{{currentApp.price}}</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
                    <b class="display-1">SoC2</b>
                    <div class="text--secondary">{{currentApp.soc2}}</div>
                  <!-- </v-card> -->
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                    <b class="display-1">Other</b>
                    <div class="text--secondary">{{currentApp.other}}</div>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                    <b class="display-1">Login URL</b>
                    <a :href="currentApp.login_url" target="_blank" class="text--red">GoTo</a>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                    <b class="display-1">Owner</b>
                    <div class="text--secondary">{{currentApp.owner}}</div>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                    <b class="display-1">Admin User</b>
                    <div v-html="beautifyEmail(currentApp.admin_user)" class="text--secondary"></div>
                </v-col>
                <v-col
                  cols="6"
                >
                    <b class="display-1">Purpose</b>
                    <div class="text--secondary">{{currentApp.purpose}}</div>
                </v-col>
              </v-row>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { fetchApps, fetchAppUsers } from '../../../api'
  import { validEmail, levelColor } from '../../../util'

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

    async mounted () {
      this.loading = true
      this.apps = await fetchApps()
      this.loading = false
    },

    computed: {
      usersTitle () {
        return 'Users'
        if (this.currentApp) {
          return `Users (${this.currentApp.application_name})`
        } else {
          return 'Users'
        }
      },
      page () {
        return Number(localStorage.getItem('page')) || 5
      }, 
    },

    methods: {
      levelColor,
      
      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },
      beautifyEmail (emails) {
        let res = ''
        const list = emails.split(' ')
        list.map(email => {
          if (validEmail(email)) {
            res += `<a href="mailto:${email}">${email}</a><br />`
          } else {
            res += `${email} <br />`
          }
        })

        return res
      },
      showDetails (item) {
        this.expanded = []
        this.currentApp = item
        this.details = true
        this.user = false
        this.expanded.push(item)
      },
      async showUsers (item) {
        this.currentApp = item
        this.user  = true
        this.details = false
        this.expanded = []
        this.expanded.push(item)
        this.loading = true
        this.users = await fetchAppUsers(item.users_table_name)
        this.loading = false
      },
    }
  }
</script>
