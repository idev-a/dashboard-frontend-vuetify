<template>
  <div
    id="admin-groups"
  >
    
    <v-card-title>
        <div class="font-weight-light body">Manage <b>groups</b> table</div>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-title>
      <div class="d-flex flex-wrap align-center">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-5"
          single-line
          hide-details
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex flex-wrap align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" class="mr-2" @click="readGroups" color="main">
              <v-icon  size="16" dark>mdi-database-search</v-icon>
            </v-btn>
          </template>
          <span>Read All</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="migratable" @click="migrate" class="mr-2" color="main"><v-icon  size="16"  dark>mdi-folder-plus-outline</v-icon></v-btn>
          </template>
          <span>Migrate</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" v-on="on" v-bind="attrs" class="mr-2" @click="downloadCSV" color="main">
              <v-icon  size="16" dark>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>Download</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" :loading="loading" :disabled="loading"  class="" @click="showCron('run_migrate_groups', 'Daily')" color="main"><v-icon  size="16" dark>mdi-clock-time-eight-outline</v-icon></v-btn>
          </template>
          <span>Cron</span>
        </v-tooltip>
      </div>
    </v-card-title>
    <div class="d-flex flex-wrap align-center">
      <v-select
        v-model="companyId"
        :rules="[rules.required]"
        chips
        small
        :items="companiesAndAll"
        @input="readGroups"
        class="mr-3"
        label="Select a company"
        hint="Select a company you want to manage"
      ></v-select>
      <v-select
        v-model="directory"
        chips
        small
        :items="directories"
        class="mr-3"
        label="Directory table"
        hint="Select a directory to migrate"
      ></v-select>
      <v-text-field
        v-model="serviceEmail"
        :loading="loading"
        label="Service account email"
        rows="2"
        auto-grow
      />
      <v-file-input
        accept=".json"
        placeholder="Import GSuite private key file (.json file)"
        prepend-icon="mdi-database-import"
        label="Private key"
        ref="myfile" 
        v-model="file"
        :loading="loading"
      ></v-file-input>
    </div>
      <v-data-table
        v-model="selectedItems"
        :loading="loading"
        :headers="headers"
        :items="items"
        :items-per-page="page"
        item-key="id"
        :search="search"
        show-select
        @update:items-per-page="getPageNum"
      > 
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                text 
                icon 
                v-on="on"
                @click.stop="updateModal(item)"
              >
                <v-icon>mdi-pen</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </template>
        <template v-slot:item.email="{ item }">
            <span v-html="beautifyEmails(item.email)"></span>
        </template>
      </v-data-table>

      <v-dialog
        v-model="updateDialog"
        max-width="1024"
      >
        <v-card>
            <v-card-title>{{ updateTitle }}</v-card-title>
            <v-card-text>
              <group-detail v-if="mode == 'View'" :currentGroup="currentGroup" />
              <v-form
                v-if="mode == 'Edit'"
                  ref="updateForm"
                  class="mt-4"
                  v-model="updateValid"
                >
                <div class="text--secondary text-center display-2">{{ currentGroup.question }}</div>
                <v-row >
                  <v-col cols="12" md="6">
                    <v-text-field
                          v-model="editItem.email"
                          label="Email" 
                          :rules="[rules.required, rules.email]"
                          hide-details="auto"
                          class="mb-3"
                        >
                      </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                          v-model="editItem.name"
                          label="Full Name" 
                          :rules="[rules.required]"
                          hide-details="auto"
                          class="mb-3"
                        >
                        </v-text-field>
                      </v-col>
              </v-row>
              <v-row >
                  <v-col cols="12" md="6">
                  <v-combobox multiple
                            v-model="editItem._members" 
                            label="Members" 
                            append-icon
                            hide-selected
                            chips
                            :items="parseItems(editItem.members)"
                            deletable-chips
                            :search-input.sync="tagSearch" 
                            :rules="[rules.emails]"
                            >
                      </v-combobox>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-combobox multiple
                            v-model="editItem._aliases" 
                            label="Aliases" 
                            append-icon
                            hide-selected
                            chips
                            :items="parseItems(editItem.aliases)"
                            deletable-chips
                            :search-input.sync="tagSearch" 
                            :rules="[rules.emails]"
                            >
                    </v-combobox>
                  </v-col>
              </v-row>
                  <v-row >
                  <v-col cols="12" md="6">
                    <v-textarea
                          v-model="editItem.description"
                          label="Description" 
                          auto-grow
                          rows="1"
                          hide-details="auto"
                          class="mb-3"
                          required
                        >
                      </v-textarea>
                  </v-col>
                  <v-col cols="12" md="4">
                      <v-select
                      v-model="editItem.company_id"
                      :rules="[rules.required]"
                    chips
                    small
                      :items="companies"
                      class="mb-3"
                      label="Company"
                    ></v-select>
                </v-col>
              </v-row>
          </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="mode == 'Edit'"
              color="primary"
              text
              :loading="loading"
              @click="updateGroup"
            >
              Update
            </v-btn>
            <v-btn
              v-if="mode == 'Edit'"
              color="primary"
              text
              :loading="loading"
              @click="deleteGroup"
            >
              Delete
            </v-btn>
            <v-btn
              color="primary"
              text
              :loading="loading"
              @click="toggleMode"
            >
              {{ btnLabel }}
            </v-btn>
            <v-btn
              color="success"
              text
              :loading="loading"
              @click="updateDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snackbar"
        bottom
        :color="color"
        >
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn
            dark
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
</template>

<script>
  import axios from 'axios'
  import { BASE_API } from '../../../../api'
  import { downloadCSV, DOMAIN_LIST, beautifyEmails } from '../../../../util'
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'AdminGroups',

    props: {
      companies: {
        type: Array
      }
    },

    data () {
      return {
        done: false,
        createValid: true,
        updateValid: true,
        loading: false,
        snackbar: false,
        message: '',
        color: 'success',
        search: '',
        tagSearch: '',
        companyId: 'All',
        selectedItems: [],
        items: [],
        file: null,
        serviceEmail: '',
        directory: '',
        directories: [
          { text: 'GSuite', value: 'google_groups'},
          { text: 'Office 365', value: 'office_365_groups'}
        ],
        updateDialog: false,
        currentGroup: {},
        editItem: {},
        defaultIndex: -1,
        defaultItem: {
        },
        mode: 'View',
        YES_NO: [
          {
            text: 'Yes',
            value: 1
          },
          {
            text: 'No',
            value: 0
          }
        ],
        headers: [
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Email',
            value: 'email',
          },
          {
            text: 'Company',
            value: 'company_id',
          },
          { text: 'Actions', value: 'action', sortable: false },
        ],
        activator: null,
        attach: null,
        editing: null,
        index: -1,
        tempItems: [
          { header: 'Select an option or create one' },
          {
            text: 'Foo',
          },
          {
            text: 'Bar',
          },
        ],
        nonce: 1,
        menu: false,
        model: [
          {
            text: 'Foo',
          },
        ],
        x: 0,
        y: 0,
            rules: {
              required: value => {
                return !!value || 'This field is required.'
              },
              email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
              },
              emails: vals => {
                if (vals == '') {
                  return true
                }
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                let emailValid = ''
                vals.map(value => {
                  emailValid = pattern.test(value) || 'Invalid e-mail.'
                })
                return emailValid
              }
            }
      }
    },

    components: {
      GroupDetail: () => import('../../component/GroupDetail')
    },

    computed: {
      ...mapState(['page', 'userId']),

      companiesAndAll() {
        return [
          'All',
          ...this.companies
        ]
      },

      btnLabel () {
        if (this.mode == 'Edit') {
          return 'View'
        } else {
          return 'Edit'
        }
      },

      updateTitle () {
        if (this.mode == 'Edit') {
          return 'Edit Group'
        } else {
          return 'View Group'
        }
      },
      migratable () {
        if (this.directory == 'google_groups') {
          return this.loading || this.companyId == 'All' || this.serviceEmail == '' || this.companyId != this.serviceEmail.split('@')[1] || this.file == null
        } else {
          return this.loading || this.companyId == 'All' || this.directory == ''
        }
      }
    },

    async mounted() {
    },

    methods: {
      ...mapActions(['showConfirm', 'showCronDialog']),

      beautifyEmails,

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      parseItems (val) {
        if (val.includes(';')) {
          return val.split(';')
        } else {
          return val.split(',')
        }
      },

      updateTags(_items) {
        const self = this
        this.$nextTick(() => {
          _items.push(...self.tagSearch.split(","));
          self.$nextTick(() => {
            self.tagSearch = "";
          });
        });
      },

    async readAll (url) {
        this.loading = true
      this.selectedItems = []
        this.items = []
      try {
        const res = await axios.get(url)
          this.items = res.data.items
          this.message = res.data.message
          this.color = res.data.status
      } catch(e) {
        this.message = 'Something wrong happened on the server.'
      } finally {
          this.loading = false
          this.snackbar = true
      }
      },

      async readGroups () {
        this.readAll(`${BASE_API}/api/admin/groups/read/${this.companyId}`)
      },

      createModal () {

      },

      updateModal (item) {
        this.currentGroup = item
        this.mode = 'View'
        this.defaultIndex = this.items.indexOf(item)
        this.editItem = Object.assign({}, item)
        this.editItem._members = this.parseItems(this.editItem.members)
        this.editItem._aliases = this.parseItems(this.editItem.aliases)
        this.updateValid = true
        this.updateDialog = true
      },

      async updateGroup () {
        this.$refs.updateForm.validate()
        if (!this.updateValid) {
          return
        }
        const self = this
        await this.$dialog.confirm({
        text: 'Do you really want to update this group?',
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              self._updateGroup()
            }
          }
        }
      })
      },

      async deleteGroup () {
        const self = this
        await this.$dialog.confirm({
        text: 'Do you really want to delete this group?',
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              self._deleteGroup()
            }
          }
        }
      })
      },

      async _updateGroup () {
        this.editItem.members = this.editItem._members.join(';')
        this.editItem.aliases = this.editItem._aliases.join(';')
        console.log(this.editItem)
        this.loading = true
      try {
        const data = await axios({
            url: `${BASE_API}/api/admin/users_groups/groups/update`,
            data: this.editItem,
            method: 'POST'
          })
          this.message = data.data.message
          this.color = data.data.status
          if (data.data.status == 'success') {
            Object.assign(this.items[this.defaultIndex], this.editItem)
            this.currentUser = this.editItem
          }
      } catch(e) {
        this.message = 'Something wrong happened on the server.'
      } finally {
          this.loading = false
          this.snackbar = true
      }
      },

      async _deleteGroup () {
        this.loading = true
        try {
          const data = await axios({
              url: `${BASE_API}/api/admin/users_groups/groups/remove`,
              data: this.editItem,
              method: 'POST'
            })
            this.message = data.data.message
            this.color = data.data.status
            if (data.data.status == 'success') {
              this.items.splice(this.defaultIndex, 1)
              this.updateDialog = false
            }
        } catch(e) {
          this.message = 'Something wrong happened on the server.'
        } finally {
            this.loading = false
            this.snackbar = true
        }
        },

        toggleMode () {
          if (this.mode == 'Edit') {
            this.mode = 'View'
          } else {
            this.mode = 'Edit'
          }
      },

      downloadCSV () {
          if (this.selectedItems.length) {
            downloadCSV(this.selectedItems)
          } else {
            downloadCSV(this.items)
          }
      },
      async migrate () {
        let formData = new FormData()
        if (this.file) {
          formData.append("file", this.file, this.file.name);
        }

        const data = {
          emails: this.serviceEmail,
          user_id: this.userId,
          directory: this.directory,
          company_id: this.companyId
        }

        const json = JSON.stringify(data);
        const blob = new Blob([json], {
          type: 'application/json'
        });

        formData.append("document", blob);
        this.file = null
        this.loading = true
        try {
          const data = await axios.post(`${BASE_API}/api/admin/migrate/groups`, formData)
          this.message = data.data.message
          this.color = data.data.status
        } catch(e) {
          this.message = 'Something wrong happened on the server.'
        } finally {
          this.loading = false
          this.snackbar = true
        }
      },

      // Cron jobs
      showCron (type, interval) {
        this.showCronDialog({dialog: true, type, interval })
      },
    },
  }
</script>

