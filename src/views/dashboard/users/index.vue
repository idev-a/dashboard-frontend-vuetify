<template>
  <v-container
    id="high-risks"
    fluid
    tag="section"
  >
    <v-card
      class="px-5 py-3"
    >
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
        :items="risks"
        :items-per-page="5"
        :search="search"
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
    name: 'DashboardHighRisksTables',

    data: () => ({
      loading: false,
      search: '',
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
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/risks/high`, {
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
