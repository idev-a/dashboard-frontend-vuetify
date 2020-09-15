<template>
  <v-container
    id="high-risks"
    fluid
    tag="section"
  >
    <blockquote class="blockquote">Applications that your organization uses.  The people that use them and its current risk based on security settings.</blockquote>
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
        <v-select
          v-model="filteredRisks"
          :items="riskItems"
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
        :headers="appHeaders"
        :items="filteredApps"
        :items-per-page="page"
        item-key="id"
        :search="search"
        single-expand
        :expanded.sync="expanded"
        @update:items-per-page="getPageNum"
      >
        <template v-slot:item.risk="{ item }">
          <v-chip :color="levelColor(item.risk_level)" dark>
            <div class="subtitle-2 text-capitalize">{{ item.risk_level ? item.risk_level : 'low' }}</div>
          </v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                v-on="on"
                color="primary"
                small
                dense
                @click.stop="showUsers(item)"
              >
                <!-- <v-icon>mdi-account-search</v-icon> -->
                Users
              </v-btn>
            </template>
            <span>Show Users</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                small
                color="primary"
                dense
                v-on="on"
                @click="showDetails(item)"
              >
                <!-- <v-icon>mdi-application</v-icon> -->
                Details
              </v-btn>
            </template>
            <span>Show Details</span>
          </v-tooltip>
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
                    <div class="text--secondary"><b>$</b>{{currentApp.price}}</div>
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
                    <b class="display-1 mr-2">Login URL</b>
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
  import { mapState, mapActions } from 'vuex';

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
      filteredRisks:['critical'], 
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
        { text: 'Actions', value: 'action', sortable: false, align: 'center', width: 180 },
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

      if (this.tempRisk) {
        this.filteredRisks = [...this.tempRisk]
        this.SET_TEMP_RISK([])
      }
    },

    computed: {
      ...mapState(['companyId', 'page', 'riskItems', 'tempRisk']),

      usersTitle () {
        return 'Users'
        if (this.currentApp) {
          return `Users (${this.currentApp.application_name})`
        } else {
          return 'Users'
        }
      },
      filteredApps () {
        return this.apps.filter(app => {
          if (this.filteredRisks.length == 0) {
            return app
          } else {
            let pattern = app.risk_level || 'low'
            pattern = pattern.toLowerCase().trim()
            if (pattern == 'critical') {
              pattern = /critical/i
            } else if (pattern == 'high') {
              pattern = /high/i
            } else if (pattern == 'medium') {
              pattern = /medium/i
            } else if (pattern == 'low') {
              pattern = /low/i
            } else if (pattern == 'informational') {
              pattern = /informational/i
            } 
            const risks = this.filteredRisks.map(risk => risk.value)
            if (this.filteredRisks.join('').match(pattern)) {
              return app
            }
          }
        })
      }
    },

    methods: {
      ...mapActions(['SET_TEMP_RISK']),

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
        if (this.expanded.includes(item)) {
          const index = this.expanded.indexOf(item);
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item)
          this.currentApp = item
          this.details = true
          this.user = false
        }
      },
      async showUsers (item) {
        this.currentApp = item
        this.user  = true
        this.details = false
        if (this.expanded.includes(item)) {
          const index = this.expanded.indexOf(item);
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item)
          this.loading = true
          this.users = await fetchAppUsers(item.users_table_name)
          this.loading = false
        }
      },
    }
  }
</script>
<style scoped>
.max-100 {
  max-width: 300px;
}
</style>