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
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="users"
        item-key="_id"
        :items-per-page="5"
        :search="search"
        :single-expand="singleExpand"
        show-expand
        :expanded.sync="expanded"
        @click:row="showDetails"
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
                  <!-- <v-card  shaped outlined class="my-0 pa-2"> -->
                    <b class="display-1">Notes</b>
                    <div class="text--secondary">{{currentUser.notes}}</div>
                  <!-- </v-card> -->
                </v-col>
                <v-col
                  cols="12"
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
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
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
      snack: false,
      snackColor: '',
      snackText: '',
      user: false,
      currentUser: '',
      singleExpand: true,
      expanded: [],
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
      users: [
      ],
    }),

    mounted () {
      this.fetchUsers()
    },

    methods: {
      beautifyApps (apps) {
        let appList = ''
        apps.map(app => {

        })
      },
      levelColor (level) {
        return levelColor(level)
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
        this.user = true
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
    }
  }
</script>
