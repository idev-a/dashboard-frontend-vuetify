<template>
  <v-container
    id="company-groups"
    fluid
    tag="section"
  >
    <blockquote class="blockquote">These are the groups that are in your directory</blockquote>
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
        :items-per-page="page"
        :search="search"
        :single-expand="singleExpand"
        show-expand
        :expanded.sync="expanded"
        @click:row="showDetails"
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
                <!-- <v-icon color="primary">mdi-information-outline</v-icon> -->
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
          <td :colspan="headers.length">
            <group-detail :currentGroup="currentGroup" />
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { BASE_API, Get } from '@/api'
  import { validEmail } from '@/util'
  import { mapState } from 'vuex'

  export default {
    name: 'DashboardCompanyGroups',

    components: {
      GroupDetail: () => import('../component/GroupDetail')
    },

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

    computed: {
      ...mapState(['page', 'companyId']),
    },

    mounted () {
      this.fetchGroups()
    },

    methods: {

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      highlightText (emails) {
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
        if (this.expanded.includes(item)) {
          const index = this.expanded.indexOf(item);
          this.expanded.splice(index, 1);
        } else {
          this.expanded.push(item)
        }
      },
      async fetchGroups () {
        this.loading = true
        const res = await Get(`groups/${this.companyId}/all`)
        this.groups = res.groups
        this.loading = false
      },
    }
  }
</script>
