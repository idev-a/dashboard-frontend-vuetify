<template>
  <v-container
      id="public_data-table"
      fluid
      tag="section"
    >
      <v-card
        class="pa-5"
      >
        <v-card-title>
          Public Data
        </v-card-title>
        <v-subheader>
          Show public data for any registered company.
        </v-subheader>
        <v-row
        >
          <v-col
          cols='12'
          md="6"
          >
          <v-select
            v-model="category"
            :loading="loadingUsers"
            chips
            :items="categories"
            label="Select a Category"
            hint="Display the table data for this company"
            @input="changeCategory"
          ></v-select>
          </v-col>
          <v-col
          cols='12'
          md="6"
          >
            <v-select
              v-model="company"
              :loading="loadingUsers"
              chips
              :items="companies"
              :label="companyLabel"
              hint="Display the table data for this company"
              @input="changeCompany"
              ></v-select>
          </v-col>
        </v-row>
        <public-data
          v-if="company"
          :title='title'
          :category='category.toLowerCase()'
          :banner="banner"
          :company="company"
          :key="componentkey"
          :mode="mode"
        >
        </public-data>
    </v-card>
  </v-container>
</template>

<script>
  import { BASE_API, fetchPublicData, Get, Post } from '@/api'
  import { DOMAIN_LIST } from '@/util'
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'PublicDataTable',

    data: () => ({
      mode: true,
      loading: true,
      loadingUsers: true,
      search: '',
      company: '',
      banner: false,
      category: 'business',
      title: 'Business Data',
      data: {},
      companyLabel: 'Select a Company',
      companies: [
      ],
      defaultCompanies: [
        '627846.com',
        'grove.co',
        'revampcybersecurity.com'
      ],
      defaultPersonalEmails: [
        'ideveloper003@gmail.com'
      ],
      categories: [
        'Business',
        'Personal'
      ],

      headers: [
        {
          value: 'company_id',
          text: 'Company',
        },
      ],
    }),

    computed: {
      ...mapState(['page']),
      ...mapState('publicdata', {
        componentkey: state => state.componentkey
      }),
    },

    components: {
      PublicData: () => import('../component/PublicData'),
    },

    async mounted () {
      await this.fetchUsers()
    },

    methods: {        
      _email (email) {
        return email.split('@')[1]
      },

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      async fetchUsers () {
        let res = await Get(`users/all`)
        res = res.users
        const companyUsers = res.filter(user => !DOMAIN_LIST.includes(user.email.split('@')[1]))
        this.defaultCompanies = []
        const self = this;
        res.map(user => { if (user.company_id) { self.defaultCompanies.push(user.company_id) }})
        this.defaultPersonalEmails = res.map(user => user.email)
        this.loadingUsers = false
      },

      async changeCategory () {
        this.company = ''
        if (this.category == 'Business') {
          this.companies = this.defaultCompanies
          this.companyLabel = 'Select a Company'
          this.title = 'Business Data'
        } else {
          this.companies = this.defaultPersonalEmails
          this.companyLabel = 'Select a Person'
          this.title = 'Personal Data'
        }
      },

      async changeCompany () {
        this.company = this.company.toLowerCase()
      },
    }
  }
</script>