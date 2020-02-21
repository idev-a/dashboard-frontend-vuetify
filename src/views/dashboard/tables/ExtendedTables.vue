<template>
  <v-container
    id="extended-tables"
    fluid
    tag="section"
  >
    <base-material-card
      color="success"
      icon="mdi-clipboard"
      inline
      title="All Users"
      class="px-5 py-3"
    >
      <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="5"
      >
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  export default {
    name: 'DashboardExtendedTables',

    data: () => ({
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
          text: 'Username',
          value: 'username',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Role',
          value: 'role',
        },
        {
          text: 'Status',
          value: 'status',
        },
        {
          text: 'IP',
          value: 'ip',
        },
        {
          text: 'Last Login',
          value: 'last_login',
        },
        {
          text: 'Member Since',
          value: 'membser_since',
        },
      ],
      users: [
      ]
    }),

    mounted () {
      this.fetchUsers()
    },

    methods: {
      fetchUsers () {
        const self = this
        self.loading = true
        fetch('http://localhost:5000/api/users/all', {
            crossdomain: true,
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET',
          })
            .then(response => response.json())
            .then(function (res) {
              self.loading = false
              self.users = res.users
            })
            .catch(error => {
              console.log(error)
              self.loading = false
            })
      },
    }
  }
</script>
