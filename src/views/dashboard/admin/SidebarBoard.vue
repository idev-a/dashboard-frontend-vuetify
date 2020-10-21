<template>
  <v-container
    id="help-board"
    class="justify-center"
    tag="section"
  >
    <v-card
      class="pa-3"
    >
      <v-card-title>
        Sidebar Board
        <v-spacer></v-spacer>
        <v-select
          v-model="form"
          return-object
          label="Users"
          :items="users"
          item-text="email"
          item-key="id"
          class="mr-2"
          @input="readAll"
        >
        </v-select>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" :disabled="!form.email||loading" v-bind="attrs" v-on="on" class="mr-2" @click="updateMenus()" color="main"><v-icon left size="16">mdi-pen</v-icon>Update</v-btn>
          </template>
          <span>Update menu</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading"  class="mr-2" @click="showCreateDialog()" color="main"><v-icon left size="16">mdi-plus</v-icon>Add</v-btn>
          </template>
          <span>Create new menu</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading"  class="mr-2" @click="readAll()" color="main"><v-icon left size="16">mdi-refresh</v-icon>Read</v-btn>
          </template>
          <span>Read menus</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-jstree 
          :data="customMenus" 
          show-checkbox 
          multiple 
          no-dots
          allow-batch 
          whole-row 
        >
        </v-jstree>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { Get, Post, fetchUsers } from '@/api'
import VJstree from 'vue-jstree'

export default {
  name: 'SidebarBoard',

  components: {
    VJstree
  },

  data () {
    return {
      loading: false,
      valid: true,
      users: [],
      items: [],
      form: {
      }
    }
  },

  computed: {
    customMenus () {
      return this.items.map(item => {
        if (item.is_admin) {
          if (this.form.role != 'Admin') {
            item.selected = false
            item.disabled = true
            item.opened = false
            item.children = item.children.map(child => {
              child.selected = false
              child.disabled = true
              return child
            })
          }
        }
        return item
      })
    }
  },

  async mounted () {
    this.getUsers()
  },

  methods: {
    async getUsers () {
      const res = await Get('users/all')
      this.users = res.users
    },
    async readAll () {
      this.loading = true
      const res = await Get(`admin/drawer/${this.form.email}/read`)
      this.items = res.items
      this.loading = false
    },
    async showCreateDialog () {
      this.loading = true
      const res = await Post('admin/drawer/create', this.form)
      this.loading = false
    },
    async updateMenus() {
      this.loading = true
      const data = {
        ...this.form,
        items: this.items
      }
      const res = await Post('admin/drawer/update', data)
      this.loading = false
    }
  }
}
</script>

<style>
.tree-default>.tree-container-ul>.tree-node {
  padding: 3px;
}

.tree-wholerow-ul  .tree-anchor span {
  font-size: 18px;
  padding: 3px;
}

.tree-default .tree-themeicon-custom {
  display: none;
}

.tree-wholerow-ul .tree-node .tree-themeicon {
  display: none;
}
</style>