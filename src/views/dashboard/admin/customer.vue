<template>
  <v-container
    id="extended-tables"
    fluid
    tag="section"
  >
    <v-card
      class="px-5 py-3"
    >
      <v-card-title>
        Customers
      </v-card-title>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          class="mt-5"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn 
              color="primary"
              v-on="on"
              @click="manageACL"
              :loading="loading"
            >
            <v-icon size="16" left>mdi-web</v-icon>ACL
            </v-btn>
          </template>
          <span>Manage ACL</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn 
              color="primary"
              v-on="on"
              :loading="loading"
              @click="refreshPage"
            >
            <v-icon size="16" left>mdi-refresh</v-icon>Refresh
            </v-btn>
          </template>
          <span>Refresh Users</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn 
              color="primary"
              v-on="on"
              :loading="loading"
              @click="showCreateDlg"
            >
            <v-icon size="16" left>mdi-plus</v-icon>Add
            </v-btn>
          </template>
          <span>Add New User</span>
        </v-tooltip>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form 
                  ref="form"
                  v-model="valid"
                >
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
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
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="editedItem.daily_tips_opt_out"
                        :items="userOptoutList"
                        label="Daily Tips Optout"
                        class="mt-2"
                        required
                      >
                        <template v-slot:selection="{ item, index }">
                          <span>{{ item ? 'Yes' : 'No' }}</span>
                        </template>
                        <template v-slot:item="{ item }">
                          <span>{{ item ? 'Yes' : 'No' }}</span>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field 
                        :rules="[rules.required]"
                        v-model.trim="editedItem.company_id"
                        label="Company Domain"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field 
                        v-model.trim="editedItem.company_name"
                        label="Company Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field 
                        :rules="[rules.required]"
                        v-model.trim="editedItem.code"
                        :append-icon="'mdi-refresh'"
                        @click:append="generateCode"
                        label="Login Code"
                        :loading="loading"
                        readonly
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="main" :loading="loading" text @click="close">Cancel</v-btn>
              <v-btn color="main" :loading="loading" :disabled="loading||!valid" text @click="create">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="users"
        item-key="id"
        :search="search"
        :items-per-page="page"
        @update:items-per-page="getPageNum"
      >
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

    <!-- ACL -->
    <v-dialog
      v-model="aclDialog"
      width="800"
    >
      <v-card>
        <v-card-title>
          Access Control List(ACL)
        </v-card-title>
        <v-card-text class="pb-0">
          <div class="mt-5">Manage Whitelist IPs</div>
        </v-card-text>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-combobox
              v-model="whitelistIPs"
              :rules="[rules.ip]"
              label="Source IPs"
              :loading="loading"
              placeholder="for example, 0.0.0.0, 192.168.2.0"
              hint="Define IP whitelist"
              persistent-hint
              outlined
              chips
              deletable-chips
              multiple
            />
          </v-form>
          <div class="mt-5">Manage Whitelist Users</div>
          <v-row>
            <v-col>
              <div class="d-flex justify-center font-weight-medium primary--text">Users</div>
              <drop-list 
                :items="srcUsers" 
                class="list"
                @reorder="$event.apply(srcUsers)" 
                @insert="onInsert1" 
                mode="cut"
              >
                <template v-slot:item="{item, reorder}">
                  <drag 
                    :data="item" 
                    class="item" 
                    :key="item.id"
                    @cut="remove(srcUsers, item)"
                  >
                    <v-sheet :key="item.id" class="pa-2" rounded :color="reorder ? 'primary' : 'white'" elevation=1><b>{{item.email}}</b> [{{item.role}}]</v-sheet>
                  </drag>
                </template>
                <template v-slot:feedback="{data}">
                  <v-sheet class="pa-2" rounded elevation=1 color="primary" :key="data.id"><b>{{data.email}}</b> [{{data.role}}]</v-sheet>
                </template>
              </drop-list>
            </v-col>
            <v-col>
              <div class="d-flex justify-center font-weight-medium success--text">Whitelist Users</div>
              <drop-list
                :items="whitelistUsers"
                class="list"
                @insert="onInsert2"
                @reorder="$event.apply(whitelistUsers)"
                mode="cut"
              >
                <template v-slot:item="{item, reorder}">
                  <drag 
                    class="item" 
                    :key="item.id" 
                    :data="item" 
                    @cut="remove(whitelistUsers, item)"
                  >
                    <v-sheet :key="item.id" class="pa-2" rounded :color="reorder ? 'success' : 'white'" elevation=1><b>{{item.email}}</b> [{{item.role}}]</v-sheet>
                  </drag>
                </template>
                <template v-slot:feedback="{data}">
                  <v-sheet rounded class="pa-2" elevation=1 color="success" :key="data.id"><b>{{data.email}}</b> [{{data.role}}]</v-sheet>
                </template>
              </drop-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="aclDialog=false">Close</v-btn>
          <v-btn color="primary" text :loading="loading" :disabled="loading || !valid" @click="saveAcl">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { Get, Post, Put } from '@/api'
  import { mapState } from 'vuex'
  import { Drag, Drop, DropList } from "vue-easy-dnd";

  export default {
    name: 'DashboardAllUsersTables',

    components: {
      Drag,
      Drop,
      DropList
    },

    data: () => ({
      loading: false,
      valid: true,
      search: '',
      snack: false,
      snackColor: '',
      snackText: '',
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
        {
          text: 'Company Domain',
          value: 'company_id',
        },
        {
          text: 'Company Name',
          value: 'company_name',
        },
        {
          text: 'Last Login',
          value: 'last_login',
        },
        {
          text: 'Member Since',
          value: 'member_since',
        },
        {
          text: 'Last IP',
          value: 'ip',
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
      userOptoutList: [
        true,
        false
      ],
      userRoleList: [
        'Admin',
        'Customer',
      ],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        email: '',
        role: 'Customer',
        status: 'Active',
        member_since: '',
        company_name: '',
        daily_tips_opt_out: false,
        code: '_'
      },
      defaultItem: {
        email: '',
        role: 'Customer',
        status: 'Pending',
        ip: '',
        last_login: '',
        member_since: '',
        company_name: '',
        code: '_',
        daily_tips_opt_out: false
      },
      aclDialog: false,
      valid: true,
      whitelistIPs: [],
      srcUsers: [],
      whitelistUsers: [],
      rules: {
        required: value => !!value || 'This field is required.',
        counter: value => value.length >= 6 || 'Min 6 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        ip: v => {
          const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
          return pattern.test(v) || 'Invalid IP address or range.'
        }
      },
    }),

    mounted () {
      this.refreshPage()  
    },

    computed: {
      ...mapState(['page']),

      formTitle () {
        return this.editedIndex === -1 ? 'New User' : 'Edit User'
      },

      emailReadonly () {
        return this.editedIndex > -1
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

      async refreshPage () {
        await this.fetchUsers()
        await this.fetchACLData()
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
      async create () {
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }
        if (this.editedIndex > -1) {
          await this.updateUser(this.editedItem)
        } else {
          await this.createUser(this.editedItem)
        }
        this.close()
      },
      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.code = this.editedItem.code || '-'
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
      async deleteUser (item) {
        this.loading = true
        const res = await Post(`users/${item.email}`)
        this.showSnack(res)
        this.loading = false
      },
      showSnack(res) {
        this.snackText = res.message
        this.snackColor = res.status
        this.snack = true
      },
      showCreateDlg () {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.dialog = true
      },
      async createUser (item) {
        console.log(item)
        this.loading = true
        const res = await Post(`users/register`, item)
        if (res.status == 'success') {
          this.users.push(item)
        }
        this.showSnack(res)
        this.loading = false
      },
      async updateUser (item) {
        this.loading = true
        const res = await Put(`users/${item.email}`, item)
        this.showSnack(res)
        if (res.status == 'success') {
          Object.assign(this.users[this.editedIndex], this.editedItem)
        }
        this.loading = false
      },
      async fetchUsers () {
        this.loading = true
        const res = await Get(`users/all`)
        this.users = res.users
        this.loading = false
      },
      async generateCode () {
        this.loading = true
        try {
          const res = await Get(`users/register/generate_code`)
          this.editedItem.code = res.code
          this.editedItem.code_expiration = this.$moment().add(1, 'year').format('YYYY-MM-DD HH:mm:ss')
        } catch (e) {
          console.log(e)
        } finally {
          this.loading = false
        }
      },
      async fetchACLData () {
        this.loading = true
        const res = await Get('admin/acl/read')
        if (res.status == 'success'){
          this.srcUsers = res.acl.src_users || this.users.map(user=>{
            return {
              id: user.id,
              email: user.email,
              role: user.role
            }
          })
          this.whitelistUsers = res.acl.whitelist_users || []
          this.whitelistIPs = res.acl.whitelist_ips || []
        }
        this.loading = false
      },
      manageACL () {
        this.aclDialog = true
        this.fetchACLData()
      },
      async saveAcl () {
        this.loading = true
        const data = {
          whitelist_ips: JSON.stringify(this.whitelistIPs),
          whitelist_users: JSON.stringify(this.whitelistUsers),
          src_users: JSON.stringify(this.srcUsers)
        }
        const res = await Post('admin/acl/update', data)
        this.showSnack(res)
        this.loading = false
      },
      onInsert1(event) {
        this.srcUsers.splice(event.index, 0, event.data);
      },
      onInsert2(event) {
        this.whitelistUsers.splice(event.index, 0, event.data);
      },
      remove(array, value) {
        let index = array.indexOf(value);
        array.splice(index, 1);
      },
    }
  }
</script>

<style lang="scss" scoped>
.list {
  border: 1px solid black;
  margin: 10px auto;
  width: 100%;
  min-height: 100%;
  border-radius: 4px;

  .item {
    padding: 0 5px;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: start;
    align-self: baseline;

    &.feedback {
      border: 2px dashed black;
    }

    &.drag-image {
      transform: translate(-50%, -50%);
    }
  }
}
</style>
