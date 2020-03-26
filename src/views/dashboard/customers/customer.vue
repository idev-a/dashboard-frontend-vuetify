<template>
  <v-container
    id="extended-tables"
    fluid
    tag="section"
  >
    <v-card
      class="px-5 py-3"
    >
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="users"
        item-key="id"
        :search="search"
        :items-per-page="page"
        @update:items-per-page="getPageNum"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
              ></v-text-field>
            </v-toolbar-title>
    
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="success" dark class="mb-2" v-on="on">Add New User</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field 
                          :rules="[rules.required, rules.email]"
                          v-model="editedItem.email"
                          label="Email"
                          required
                          :readonly="emailReadonly"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="editedItem.role"
                          :rules="[rules.required]"
                          :items="userRoleList"
                          label="Role"
                          class="mt-2"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="editedItem.status"
                          :rules="[rules.required]"
                          :items="userStatusList"
                          label="Status"
                          class="mt-2"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="create">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn 
                  text 
                  icon 
                  v-on="on"
                  @click="editItem(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit User</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn 
                <v-btn 
                  text 
                  icon 
                  v-on="on"
                  @click="deleteItem(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete User</span>
            </v-tooltip>
        </template>
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
    name: 'DashboardAllUsersTables',

    data: () => ({
      loading: false,
      search: '',
      snack: false,
      snackColor: '',
      snackText: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
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
        // {
        //   text: 'IP',
        //   value: 'ip',
        // },
        {
          text: 'Last Login',
          value: 'last_login',
        },
        {
          text: 'Member Since',
          value: 'member_since',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      users: [
      ],
      userStatusList: [
        'Pending',
        'Active',
        'Denied'
      ],
      userRoleList: [
        'Customer',
      ],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        email: '',
        role: '',
        status: '',
        member_since: '',
      },
      defaultItem: {
        email: '',
        role: '',
        status: '',
        ip: '',
        last_login: '',
        member_since: '',
      },
      rules: {
        required: value => !!value || 'This field is required.',
        counter: value => value.length >= 6 || 'Min 6 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
    }),

    mounted () {
      this.fetchUsers()
    },

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New User' : 'Edit User'
      },

      emailReadonly () {
        return this.editedIndex > -1
      },

      page () {
        return Number(localStorage.getItem('page')) || 5
      }, 
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    methods: {
      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      changeStatus (val) {
        console.log(val)
      },
      save (item) {
        this.updateUser(item)
      },
      cancel () {
      },
      open () {
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      create () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
          this.updateUser(this.editedItem)
        } else {
          this.users.push(this.editedItem)
          this.createUser(this.editedItem)
        }
        this.close()
      },
      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.users.indexOf(item)
        const res = confirm('Are you sure you want to delete this item?')
        if (res == true) {
          this.users.splice(index, 1)
          this.deleteUser(item)
        } 
      },
      deleteUser (item) {
        const self = this
        self.loading = true
        axios({
            url: `${BASE_API}/api/users/${item.email}`,
            method: 'POST',
          })
            .then(function (res) {
              self.snackText = res.data.message
              if (res.data.status === 'ok') {
                self.snackColor = 'success'
              } else {
                self.snackColor = 'error'
              }
              self.snack = true
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },
      createUser (item) {
        const self = this
        self.loading = true
        axios({
            url: `${BASE_API}/api/users`,
            data: item,
            method: 'POST',
          })
            .then(function (res) {
              self.snackText = res.data.message
              if (res.data.status === 'ok') {
                self.snackColor = 'success'
              } else {
                self.snackColor = 'error'
              }
              self.snack = true
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },
      updateUser (item) {
        const self = this
        self.loading = true
        axios({
            url: `${BASE_API}/api/users/${item.email}`,
            data: {
              status: item.status,
              role: item.role
            },
            method: 'PUT',
          })
            .then(function (res) {
              self.snackText = res.data.message
              if (res.data.status === 'ok') {
                self.snackColor = 'success'
              } else {
                self.snackColor = 'error'
              }
              self.snack = true
            })
            .catch(error => {
              console.log(error)
            })
            .finally(() => {
              self.loading = false
            })
      },
      fetchUsers () {
        const self = this
        self.loading = true
        axios(`${BASE_API}/api/users/all`, {
            method: 'GET',
          })
            .then(function (res) {
              self.users = res.data.users
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
