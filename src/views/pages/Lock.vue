<template>
  <v-container
    id="lock"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center" no-gutters>
      <v-col cols="12" lg="6" md="6">
        <v-slide-y-transition appear>
          <v-card
            class="mt-6 mt-md-0"
            light
            max-width="100%"
          >
            <v-card-text class="text-center py-12">
              <v-icon x-large color="blue darken-2">mdi-lock</v-icon>
              <div class="display-2 font-weight-bold mt-3 mb-3 text--darken-2 blue--text">
                Just to be safe, we logged you out.
              </div>

              <div class="display-1 font-weight-bold mt-3 mb-10 text--darken-2 dark--text">
                Log back in to pick up where you left off.
              </div>

              <v-btn
                class="ma-0"
                color="success"
                @click="gotoLogin"
              >
                Login Again
              </v-btn>
            </v-card-text>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PagesLock',

    data: ()  => ({
      loading: false,
    }),

    components: {
      PagesBtn: () => import('./components/Btn'),
    },

    mounted () {
      // logout
      localStorage.setItem('jwt', null)
    },

    methods: {
      gotoLogin () {
        this.$router.push({ name: 'Login' })
      }
    }
  }
</script>
