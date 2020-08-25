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
    
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-2"
          min-width="0"
          v-bind="attrs"
          v-on="on"
          text
          to="/"
        >
          <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>
      </template>
      <span>Dashboard</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="isAdmin"
          v-bind="attrs"
          v-on="on"
          class="ml-2"
          min-width="0"
          text
          @click="showCronDialog({dialog: true, type: 'All', interval: 'Daily & Weekly'})"
        >
          <v-icon>mdi-clock-time-eight-outline</v-icon>
        </v-btn>
      </template>
      <span>Crons</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-2"
          min-width="0"
          v-bind="attrs"
          v-on="on"
          text
          to="/pages/lock"
        >
          <v-icon>mdi-lock-open-outline</v-icon>
        </v-btn>
      </template>
      <span>Lock Screen</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ml-2"
          min-width="0"
          v-bind="attrs"
          v-on="on"
          text
          to="/help/get-started"
        >
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
      </template>
      <span>Help</span>
    </v-tooltip>

    <v-menu
      v-if="false"
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
        two-line
        dense
        min-height="50"
        min-width="350"
        light
      >
        <v-list-item-group>
          <template v-for="(item, index) in notifications">
            <v-list-item :key="index">
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle class="text--primary" v-text="item.msg"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon class="mb-2">mdi-clock</v-icon>
                <v-list-item-action-text v-text="item.time"></v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-item-group>
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
        nav
      >
        <v-list-item-group v-model="menuItem" color="primary">
          <v-list-item
            v-for="(p, i) in profile"
            :key="`item-${i}`"
            @click="goTo(p.name)"
          >
            <v-list-item-content>
              <v-list-item-title 
                v-text="p.title" 
              />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
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
    <cron-dialog type="All"  interval="Daily & Weekly" />
  </v-app-bar>
</template>

<script>
  // Components
  import { VHover, VListItem } from 'vuetify/lib'

  // Utilities
  import { mapState, mapMutations, mapActions } from 'vuex'

  import { enableDailyTips } from '../../../../api'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      CronDialog: () => import('../../component/CronDialog'),

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

    sockets: {
      connect() {
        // Fired when the socket connects.
        console.log('store socket connected')
      },

      disconnect() {
        console.log('store socket disconnected')
      },

      // Fired when the server sends something on the "messageChannel" channel.
      notification(data) {
        console.log('message', data)
        try {
          const user_id = JSON.parse(localStorage.getItem('user')).id
          if (data.user_id == user_id) {
            this.notification = data.msg
            this.snackbar = true
            this.addNotification({
              title: data.title,
              msg: data.msg,
              time: this.$moment().format('MM:DD HH:mm')
            })
          }
        } catch (e) {
          console.log(e)
        }
      }
    },

    data: () => ({
      snackbar: false,
      menuItem: '',
      notification: '',
      profile: [
        { title: 'Profile', name: 'My Profile' },
        // { title: 'Settings', name: 'Settings' },
        { title: 'Log out', name: 'Login' },
      ],
    }),

    computed: {
      ...mapState(['drawer', 'connected', 'message', 'notifications', 'isAdmin']),
    },

    async mounted () {
      await enableDailyTips()
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER'
      }),

      ...mapActions(['addNotification', 'showCronDialog']),

      goTo (name) {
        if (name === 'Login') {
          localStorage.setItem('jwt', null)
          window.location.href = '/pages/login'
        } else {
          this.$router.push({ name })
        }
        
      }
    },
  }
</script>
