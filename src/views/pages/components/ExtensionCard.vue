<template>
  <v-card
    :light="ext.best"
    class="v-card--ext mx-auto pt-3 pb-4 px-2 text-center"
    min-width="100%"
  >
    <v-card-title
      class="grey--text"
    >
      {{ ext.name }}
     
    </v-card-title>

    <v-avatar
      class="profile"
      color="white"
      size="80"
      tile
    >
      <v-img
        :src="ext.icon"
      >
      </v-img>
    </v-avatar>

    <h2
      class="display-1 font-weight-light mb-3"
      v-text="ext.version"
    />

    <v-card-text
      class="body-1 font-weight-light pa-1 min-150"
      v-text="ext.desc"
    />

    <v-card-actions>
      <v-btn
        color="purple"
        :href="webstoreLink(ext.id)"
        target="_blank"
        text
      >
        Explore
      </v-btn>
       <v-spacer></v-spacer>
      <v-chip   :color="highlight(ext.risk)" dark>{{ riskyText(ext.risk) }}</v-chip>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'ExtensionCard',

    components: {
      PagesBtn: () => import('./Btn'),
    },

    data: () => ({
      show: false,
    }),

    methods: {
      highlight (risk) {
        if (risk < 50) {
          return 'green darken-1'
        } else if (risk < 200) {
          return 'red lighten-1'
        } else {
          return 'red darken-1'
        }
      },

      riskyText (risk) {
        let label = risk + ' '
        return label
        if (risk < 50) {
          label += 'Low'
        } else if (risk < 200) {
          label += 'Medium'
        } else {
          label += 'High'
        }
        return label
      },

      webstoreLink (link) {
        return `https://chrome.google.com/webstore/detail/${link}`
      }
    },

    props: {
      ext: {
        type: Object,
        default: () => ({
          best: false,
          heading: undefined,
          icon: undefined,
          title: undefined,
          text: undefined,
        }),
      },
    },
  }
</script>

<style lang="sass">
  .v-card--ext
    .v-avatar
      border-radius: 50%
      border: 1px solid #E5E5E5
      margin: 10px 0

    
</style>

<style>
  .min-150 {
    height: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*.min-150:hover {
    overflow: visible;
  }*/
</style>
