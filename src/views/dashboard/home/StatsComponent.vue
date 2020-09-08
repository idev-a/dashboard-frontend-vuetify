<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="black darken-4"
        icon="mdi-alert-outline"
        title="Critical Risks"
        :value="smallCards.critical_risk"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View All Critical Risks"
        to="Critical Risks"
        hover
        ripple
      />
    </v-col>
    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="red darken-4"
        icon="mdi-alert-outline"
        title="High Risks"
        :value="smallCards.high_risk"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View All High Risks"
        to="High Risks"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="red lighten-1"
        icon="mdi-alert-outline"
        title="Medium Risks"
        :value="smallCards.medium_risk"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View All Medium Risks"
        to="Medium Risks"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="yellow darken-1"
        icon="mdi-alert-outline"
        title="Low Risks"
        :value="smallCards.low_risk"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View All Low Risks"
        to="Low Risks"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="grey darken-1"
        icon="mdi-alert-outline"
        title="Informational Risks"
        :value="smallCards.informational_risk"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View All Informational Risks"
        to="Informational Risks"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="success"
        icon="mdi-alert-outline"
        title="Application Risk"
        :value="smallCards.applications"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View All Applications Data"
        to="Applications"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="secondary"
        icon="mdi-account-multiple"
        title="Users"
        :value="smallCards.users"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View Details"
        to="Users"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="secondary"
        icon="mdi-account-group-outline"
        title="Groups"
        :value="smallCards.groups"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View Details"
        to="Groups"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="secondary"
        icon="mdi-database"
        title="Public Data"
        :value="smallCards.public_data"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View Details"
        to="Public Data"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="red lighten-1"
        icon="mdi-security"
        title="Email Security"
        :value="smallCards.email_security"
        sub-icon="mdi-chevron-triple-right"
        sub-text="Phishing, Spam"
        to="Email Security"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="red lighten-1"
        icon="mdi-security"
        title="Network Security"
        :value="smallCards.network_security"
        sub-icon="mdi-chevron-triple-right"
        sub-text="Wifi, Internet"
        to="Network Security"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="red lighten-1"
        icon="mdi-security"
        title="Physial Security"
        :value="smallCards.physical_security"
        sub-icon="mdi-chevron-triple-right"
        sub-text="Doors, Alarms, Locks"
        to="Physical Security"
        hover
        ripple
      />
    </v-col>

     <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="red lighten-1"
        icon="mdi-security"
        title="Device Security"
        :value="smallCards.device_security"
        sub-icon="mdi-chevron-triple-right"
        sub-text="Doors, Alarms, Locks"
        to="Device Security"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="success"
        icon="mdi-poll"
        title="Charts"
        :value="smallCards.charts"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View Details"
        to="Charts"
        hover
        ripple
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="info"
        icon="mdi-link"
        title="Links"
        :value="smallCards.links"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View Details"
        flat
        dark
      />
    </v-col>

    <v-col
      cols="12"
      sm="6"
      lg="3"
    >
      <base-material-stats-card
        :loading="loading"
        color="info"
        icon="mdi-alert-rhombus-outline"
        title="Other"
        :value="smallCards.other"
        sub-icon="mdi-chevron-triple-right"
        sub-text="View Details"
        dark
      />
    </v-col>
  </v-row>
</template>

<script>
import { Get } from '@/api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'StatsComponent',

    data () {
      return {
        loading: false,
        banner: true,
        smallCards: {
          critical_risk: '0',
          high_risk: '0',
          medium_risk: '0',
          low_risk: '0',
          informational_risk: '0',
          other: '0',
          applications: '0',
          email_security: '0',
          network_security: '0',
          physical_security: '0',
          device_security: '0',
          company_info: '0',
          users: '0',
          groups: '0',
          public_data: '0',
          website: '0',
          alerts: '0',
          charts: '0',
          links: '0'
        },
      }
    },

    computed: {
      ...mapState(['companyId']),
    },

    watch:{
      companyId: {
        handler(newValue) {
          if (newValue) {
            console.log('StatsComponent', newValue)
            this.fetchAllCardData()
          }
        },
        immediate: true
      }
    },

    methods: {
      async fetchAllCardData () {
        this.loading = true
        const res = await Get(`dashboard/${this.companyId}/all`)
        this.smallCards = res
        this.loading = false
      },
    },
  }
</script>