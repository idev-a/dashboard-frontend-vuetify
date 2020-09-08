<template>
  <v-container
    id="admin-users-groups-board"
    fluid
    tag="section"
  >
    <v-card
      class="pa-5"
    >
      <v-card-title>
         Users & Groups (users & groups)
      </v-card-title>
      <v-card-text>
        <v-tabs
          class="mt-4 border"
          background-color="main"
          color="white"
          light
          centered
          grow
          flat
          show-arrows
        >
          <v-tabs-slider class="blue darken-3"></v-tabs-slider>
        
          <v-tab
            v-for="(data, key) in tabs"
            :key="data.key"
            :href="`#${data.key}`"
          >
            {{data.title}}
          </v-tab>

          <v-tab-item
            value="users"
          >
            <user-component :companies="companies" />
          </v-tab-item>
          <v-tab-item
            value="groups"
          >
            <group-component :companies="companies" />
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { BASE_API, getCompaniesUsers } from '@/api'
  import { downloadCSV, DOMAIN_LIST, beautifyEmails } from '@/util'
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'UsersAndGroups',

    data () {
      return {
        companies: [],
        tabs: [
          {
            key: 'users',
            bgColor: 'success',
            title: 'Users'
          },
          {
            key: 'groups',
            bgColor: 'orange accent-3',
            title: 'Groups'
          },
            ],
      }
    },

    components: {
      UserComponent: () => import('./Users'),
      GroupComponent: () => import('./Groups')
    },

    async mounted() {
      this.companies = await getCompaniesUsers()
    },
  }
</script>