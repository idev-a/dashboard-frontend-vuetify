<template>
  <v-app-bar
    absolute
    color="transparent"
    flat
    height="85"
  >
    <v-container class="px-0 ">
      <v-toolbar-title
        class="font-weight-light hidden-xs-only"
        v-text="title"
      />


      <!-- <div class="display-2 d-flex justify-center w-100 font-weight-medium">Welcome to the Secure Dashboard</div> -->

      <v-btn
        v-for="(item, i) in items"
        :key="i"
        @click="goTo(item.name)"
        min-height="48"
        min-width="40"
        text
      >
        <v-icon
          :left="$vuetify.breakpoint.mdAndUp"
          size="20"
          v-text="item.icon"
        />

        <span
          class="hidden-sm-and-down"
          v-text="item.text"
        />
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'PagesCoreAppBar',

    data: () => ({
      items: [
        // {
        //   icon: 'mdi-view-dashboard',
        //   text: 'Dashboard',
        //   name: 'Dashboard',
        //   to: '/',
        // },
        // {
        //   icon: 'mdi-account-multiple-plus',
        //   text: 'Register',
        //   name: 'Register',
        //   to: '/pages/register',
        // },
        // {
        //   icon: 'mdi-fingerprint',
        //   text: 'Login',
        //   name: 'Login',
        //   to: '/pages/login',
        // },
        // {
        //   icon: 'mdi-lock-open-outline',
        //   text: 'Lock',
        //   name: 'Lock',
        //   to: '/pages/lock',
        // },
      ],
      titles: {
        '/pages/lock': 'Lock Page',
        '/pages/login': 'Login Page',
        '/pages/register': 'Register Page',
      },
    }),

    computed: {
      title () {
        return this.titles[this.$route.path]
      },
    },

    methods: {
      goTo (name) {
        const token = localStorage.getItem('jwt')
        if (this.$router.history && this.$router.history.current && this.$router.history.current.name == name) {
          return;
        }
        if (name === 'Dashboard') {
          if (token === 'success') {
            this.$router.push({ name });
          }
        } else {
          this.$router.push({ name });
        }
      },
    },
  }
</script>
