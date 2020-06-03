<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="$vuetify.breakpoint.smAndDown ? setDrawer(!drawer) : $emit('input', !value)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

  <!--   <v-text-field
      :label="$t('search')"
      color="secondary"
      hide-details
      style="max-width: 165px;"
    >
      <template
        v-if="$vuetify.breakpoint.mdAndUp"
        v-slot:append-outer
      >
        <v-btn
          class="mt-n2"
          elevation="1"
          fab
          small
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field> -->

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/pages/lock"
    >
      <v-icon>mdi-lock-open-outline</v-icon>
    </v-btn>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="red"
            overlap
            bordered
          >
            <template v-slot:badge>
              <span>{{ notifications.length }}</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
      >
        <div>
          <app-bar-item
            v-for="(n, i) in notifications"
            :key="`item-${i}`"
          >
            <v-list-item-title v-text="n" />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>

    <v-menu
      bottom
      left
      min-width="200"
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        flat
        nav
      >
        <template v-for="(p, i) in profile">
          <v-divider
            v-if="p.divider"
            :key="`divider-${i}`"
            class="mb-2 mt-2"
          />

          <app-bar-item
            v-else
            :key="`item-${i}`"
          >
            <v-list-item-title 
              v-text="p.title" 
              @click="goTo(p.name)"
            />
          </app-bar-item>
        </template>
      </v-list>
    </v-menu>
    <v-snackbar
      v-model="snackbar"
      bottom
      color="success"
      >
      {{ notification }}
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app-bar>
</template>

<script>
  // Components
  import { VHover, VListItem } from 'vuetify/lib'

  // Utilities
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      AppBarItem: {
        render (h) {
          return h(VHover, {
            scopedSlots: {
              default: ({ hover }) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    watch: {
      connected () {
        console.log('store socket', this.connected)
      },

      message () {
        console.log(this.message[0])
        try {
          const user_id = JSON.parse(localStorage.getItem('user')).id
          if (this.message[0].user_id == user_id) {
            this.notification = this.message[0].msg
            this.snackbar = true
            this.addNotification(this.notification)
          }
        } catch (e) {}
      }
    },

    data: () => ({
      snackbar: false,
      notification: '',
      profile: [
        { title: 'Profile', name: 'My Profile' },
        // { title: 'Settings', name: 'Settings' },
        { divider: true },
        { title: 'Log out', name: 'Login' },
      ],
    }),

    computed: {
      ...mapState(['drawer', 'connected', 'message', 'notifications']),
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER'
      }),

      ...mapActions(['addNotification']),

      goTo (name) {
        if (name === 'Login') {
          localStorage.setItem('jwt', null)
        } 
        
        this.$router.push({ name })
      }
    },
  }
</script>
