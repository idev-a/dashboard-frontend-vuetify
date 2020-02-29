<template>
  <v-container
    id="medium-risks"
    fluid
    tag="section"
  >
    <v-card
      class="px-5 py-3"
    >
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="risks"
        :items-per-page="5"
      >
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
  import axios from 'axios'

  export default {
    name: 'DashboardMediumRisksTables',

    data: () => ({
      loading: false,
      snack: false,
      snackColor: '',
      snackText: '',
      pagination: {},
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
          text: 'Question',
          value: 'Question',
        },
        {
          text: 'Answer',
          value: 'Answer',
        },
        {
          text: 'Category',
          value: 'Category',
        },
        {
          text: 'Description',
          value: 'Description',
        },
        {
          text: 'Notes',
          value: 'Notes',
        },
      ],
      risks: [
      ],
    }),

    mounted () {
      this.fetchRisks()
    },

    methods: {
      fetchRisks () {
        let user = {}
        try {
          user = JSON.parse(localStorage.getItem('user'))
        } catch(e) {}
        const companyId = user.email.split('@')[1];
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/risks/medium/${companyId}`, {
            method: 'GET',
          })
            .then(function (res) {
              self.risks = res.data.risks
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
