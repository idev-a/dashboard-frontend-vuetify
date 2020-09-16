<template>
  <v-container
    id="extension"
    class="fill-height"
    tag="section"
  >
    <v-row
      align="center"
    >
      <v-col    
        class="mt-10"
        cols="12"
      >
        <pages-heading class="mb-12">
          Dashboard for Chrome Extensions <span class="display-2">({{email}})</span>
        </pages-heading>

        <div class="display-1 font-weight-light grey--text text--darken-2">
          We have found out the vulnerabilities among your extensions.
        </div>
      </v-col>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="green"
        ></v-progress-linear>
      <template v-else v-for="(ext, i) in exts">
        <v-col
          :key="i"
          class="d-flex"
          cols="12"
          sm="6"
          md="3"
        >
          <extension-card :ext="ext"></extension-card>
        </v-col>

       <!--  <v-col
          v-if="(i >= 1 && $vuetify.breakpoint.smAndDown) && i + 1 !== exts.length"
          :key="`divider-${i}`"
          class="pa-6"
          cols="12"
        >
          <v-divider />
        </v-col> -->
      </template>
    </v-row>
  </v-container>  
</template>
<script>
import { BASE_API, Get, Post } from '@/api'
  export default {
    name: 'PagesExtension',

    components: {
      PagesHeading: () => import('./components/Heading'),
      ExtensionCard: () => import('./components/ExtensionCard'),
    },

    data: () => ({
      loading: false,
      message: '',
      exts: [
      ]
    }),

    computed: {
      email () {
        return this.$route.params.email
      }
    },

    mounted () {
      this.fetchExts()
    },

    methods: {
      async fetchExts () {
        this.loading = true
        try {
          const res = await Post(`admin/ext/mine`, { email: this.email })
          this.exts = res.exts
          this.message = res.message
        } catch(e) {
          this.message = 'Something wrong happened on the server.'
        } finally {
          this.loading = false
        }
      }
    },
  }
</script>