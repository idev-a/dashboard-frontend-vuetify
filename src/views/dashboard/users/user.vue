<template>
  <v-container
    id="company-users"
    fluid
    tag="section"
  >
    <blockquote class="blockquote">These are the users that are in your directory</blockquote>
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
        :headers="headers"
        :items="filteredUsers"
        item-key="_id"
        :items-per-page="page"
        :search="search"
        single-expand
        @click:row="showDetails"
        :expanded.sync="expanded"
        @update:items-per-page="getPageNum"
      >
        <template v-slot:item.email="{ item }">
          <span v-html="highlightText(item.email)"></span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                color="primary"
                v-on="on"
                @click.stop="showDetails(item)"
              >
                <!-- <v-icon>mdi-account-search</v-icon> -->
                Details
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
            <user-detail :currentUser="currentUser" />
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar bottom v-model="snackbar" :timeout="3000" :color="color">
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
  import { validEmail, levelColor, highlightText } from '../../../util'
  import axios from 'axios'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'DashboardCompanyUsers',

    data: () => ({
      loading: false,
      search: '',
      snackbar: false,
      color: '',
      message: '',
      currentUser: '',
      singleExpand: true,
      expanded: [],
      filteredRisks:[], 
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
        { text: 'Actions', value: 'action', sortable: false, align: 'center' },
      ],
      users: []
    }),

    mounted () {
      if (this.tempRisk) {
        this.filteredRisks = [...this.tempRisk]
        this.SET_TEMP_RISK([])
      }
      this.fetchUsers()
    },

    components: {
      UserDetail: () => import('../component/UserDetail')
    },

    computed: {
      ...mapState(['page', 'companyId', 'riskItems', 'tempRisk']),

      filteredUsers () {
        return this.users.filter(user => {
          if (this.filteredRisks.length == 0) {
            return user
          } else {
            let pattern = user.risk_level || 'low'
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
            if (risks.join('').match(pattern)) {
              return user
            }
          }
        })
      }
    },

    methods: {
      ...mapActions(['SET_TEMP_RISK']),

      levelColor,
      highlightText,

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      showDetails (item) {
        this.currentUser = item
        // this.user = true
        this.expanded = []
        this.expanded.push(item)
      },
      fetchUsers () {
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/users/${this.companyId}/all`, {
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
<style scoped>
.max-100 {
  max-width: 300px;
}
</style>