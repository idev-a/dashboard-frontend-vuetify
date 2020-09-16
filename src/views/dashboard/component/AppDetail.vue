<template>
  <div
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
        <b class="display-1">SoC2</b>
        <div class="text--secondary">{{currentApp.soc2}}</div>
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
        <b class="display-1 mr-1">
          <a v-if="currentApp.login_url" :href="currentApp.login_url" target="_blank" class="text--red">Login URL</a>
          <span v-else>Login URL</span>
        </b>
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
        <div v-html="beautifyEmails(currentApp.admin_user)" class="text--secondary"></div>
      </v-col>
      <v-col
        cols="6"
      >
        <b class="display-1">Purpose</b>
        <div class="text--secondary">{{currentApp.purpose}}</div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { beautifyEmails } from '@/util'
  export default {
    name: "AppDetail",

    data() {
      return { }
    },

    props: ['currentApp'],

    methods: {
      beautifyEmails
    }
  }
</script>