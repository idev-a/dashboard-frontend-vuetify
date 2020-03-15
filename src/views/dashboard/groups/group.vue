<template>
  <v-container
    id="company-groups"
    fluid
    tag="section"
  >
    <v-card
      class="px-5 py-3"
      icon="mdi-account-group-outline"
      title="Groups"
    >
      <v-card-title>
        Groups
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
        :items="groups"
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
            <div
              class="px-3 py-1"
            >
              <v-card-title>
                {{ currentGroup.name }}
              </v-card-title>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Description</div>
                    <span>{{currentGroup.description}}</span>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-card shaped outlined class="my-0 pa-2">
                    <div class="display-2 font-weight-light">Members</div>
                    <div class="d-flex flex-wrap" v-html="beautifyEmail(currentGroup.members)">
                    </div>
                  </v-card>
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
  import { validEmail } from '../../../util'
  import axios from 'axios'

  export default {
    name: 'DashboardCompanyGroups',

    data: () => ({
      loading: false,
      search: '',
      snack: false,
      snackColor: '',
      snackText: '',
      pagination: {},
      group: false,
      currentGroup: '',
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
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Email',
          value: 'email',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      groups: [
      ],
    }),

    mounted () {
      this.fetchGroups()
    },

    methods: {
      beautifyEmail (emails) {
        if (!emails) {
          return
        }
        let res = ''
        const list = emails.split(';')
        list.map(email => {
          if (validEmail(email)) {
            res += `<a href="mailto:${email}" class="mr-2 mb-2">${email}</a>`
          } else {
            res += `${email} <br />`
          }
        })

        return res
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
        this.currentGroup = item
        this.user = true
        this.expanded = []
        this.expanded.push(item)
      },
      fetchGroups () {
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/groups/${companyId}/all`, {
            method: 'GET',
          })
            .then(function (res) {
              self.groups = res.data.groups
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