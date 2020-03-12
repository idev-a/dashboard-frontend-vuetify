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
                @click="showDetails(item)"
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
          <td :colspan="headers.length">
            <base-material-card
              color="success"
              class="px-5 py-3"
              icon="mdi-alert-outline"
              :title="currentUser.firstname_lastname"
            >
              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Email</div>
                    <span v-html="beautifyEmail(currentUser.email)"></span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Department</div>
                    <span>{{currentUser.department}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Previleged</div>
                    <v-chip :color="currentUser.privileged_account == 1 ? 'success' : 'default'" dark><div class="subtitle-2">{{ currentUser.privileged_account == 1 ? 'Yes' : 'No' }}</div></v-chip>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Active</div>
                    <span>{{currentUser.other}}</span>
                    <v-chip :color="currentUser.email_not_active == 1 ? 'success' : 'default'" dark><div class="subtitle-2">{{ currentUser.email_not_active == 1 ? 'Yes' : 'No' }}</div></v-chip>
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
                    <div class="display-2 font-weight-light">Individual Risk</div>
                    <v-chip :color="levelColor(currentUser.risk_level)" dark><div class="subtitle-2">{{ currentUser.risk_level ? currentUser.risk_level : 'low' }}</div></v-chip>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Type</div>
                    <span>{{currentUser.user_type}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Location</div>
                    <span>{{currentUser.location ? currentUser.location.replace('/', '') : ''}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  sm="3"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Job Title</div>
                    <span>{{currentUser.job_title}}</span>
                  </v-card>
                </v-col>
              </v-row>
               <v-row>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Observations</div>
                    <span>{{currentUser.observations}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  sm="6"
                >
                  <v-card  shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Notes</div>
                    <span>{{currentUser.notes}}</span>
                  </v-card>
                </v-col>
              </v-row>
            </base-material-card>
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
  import { validEmail } from '../../../util'
  import axios from 'axios'

  export default {
    name: 'DashboardCompanyUsers',

    data: () => ({
      loading: false,
      search: '',
      snack: false,
      snackColor: '',
      snackText: '',
      pagination: {},
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
      beautifyEmail (email) {
        if (validEmail(email)) {
          return `<a href="mailto:${email}">${email}</a>`
        } else {
          return email
        }
      },
      levelColor (level) {
        let color = 'yellow darken-1'
        level = level ? level.toLowerCase() : 'low'
        switch (level) {
          case 'high':
            color = 'red darken-4'
            break
          case 'medium':
            color = 'red lighten-1'
            break
          case 'low':
            color = 'yellow darken-1'
            break
        }
        return color
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
