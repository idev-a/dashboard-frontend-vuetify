<template>
  <v-container
      id="meraki-board"
      fluid
      tag="section"
    >
      <v-card
        class="pa-5"
      >
        <v-card-title>
          GSuite Board
        </v-card-title>
        <v-card-text>
          <v-tabs
            class="mt-4 border"
            background-color="main"
            color="white"
            light
            centered
            grow
            flat
            show-arrows
          >
            <v-tabs-slider class="blue darken-3"></v-tabs-slider>
          
            <v-tab
              v-for="(data, key) in gsuites"
              :key="data.key"
              :href="`#${data.key}`"
              @change="changeTab(`${data.key}`)"
            >
              {{data.title}}
            </v-tab>

            <v-tab-item
              value="google_drive_shared"
            >
              <v-card-title>
                <div>
                  <div>gsuite_drive_shared</div>
                  <v-subheader>Find external shared links</v-subheader>
                </div>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" :disabled="!importable"  class="mr-2" @click="importKey" color="main">Import & Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
                <v-btn :loading="loading" :disabled="loading"  class="" @click="showCron('run_g_drive_share', 'Weekly')" color="main">Google Drives<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
              </v-card-title>
              <v-row>
                <v-col cols='12' md="4">
                  <v-text-field
                    v-model="emails"
                    :rules="[rules.required]"
                    prepend-icon="mdi-email"
                    :loading="loading"
                    label="Owner Emails"
                    hint="Ctrl + Enter to run the google drive script"
                    @input="changeAccountEmail"
                    @keyup.ctrl.13="keyDownOnImport"
                />
                </v-col>
                <v-col cols='12' md="4">
                  <v-file-input
                    accept=".json"
                    placeholder="Import GSuite private key file (.json file)"
                    prepend-icon="mdi-database-import"
                    label="Private key"
                    ref="myfile" 
                    v-model="file"
                    :loading="loading"
                  ></v-file-input>
                </v-col>
                <v-col cols='12' md="4">
                  <v-textarea
                    v-model="company_id"
                    :rules="[rules.required]"
                    prepend-icon="mdi-application"
                    :loading="loading"
                    label="Company Name"
                    auto-grow
                    rows="1"
                    hide-details="auto"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  class="mb-5"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" :disabled="loading" class="mr-2" @click="readAllShared" color="main">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
                <v-btn :loading="loading" class="mr-2" :disabled="loading || (!items.length && !selectedItems.length)" @click="sendAttachment" color="main">Send<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
                <v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
              </v-card-title>
              <v-data-table
                v-model="selectedItems"
                :loading="loading"
                :headers="driveHeaders"
                :items="items"
                :items-per-page="page"
                item-key="id"
                :search="search"
                show-select
                @update:items-per-page="getPageNum"
              > 
                <template v-slot:item.email="{ item }">
                    <span v-html="beautifyEmails(item.email)"></span>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item
              value="gsuite_users"
            >
             <v-card-title>
              <div>
                <div>gsuite_users, google_groups, gsuite_devices</div>
                <v-subheader>Find gsuite users, groups and devices</v-subheader>
              </div>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" :disabled="!importable"  class="mr-2" @click="importKey" color="main">Import & Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading"  class="mr-2" @click="showCron('run_gsuite_users', 'Daily')" color="main">Users<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
                  </template>
                  <span>Crons for Gsuite Users</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading"  class="mr-2" @click="showCron('run_google_groups', 'Daily')" color="main">Groups<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
                  </template>
                  <span>Crons for Google Groups</span>
                </v-tooltip>
                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading"  class="" @click="showCron('run_gsuite_devices', 'Daily')" color="main">Devices<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
                </template>
                <span>Crons for GSuite Devices</span>
              </v-tooltip>
            </v-card-title>
            <v-row>
              <v-col cols='12' md="4">
                <v-text-field
                  v-model="emails"
                  :rules="[rules.required]"
                  prepend-icon="mdi-email"
                  :loading="loading"
                  label="Owner Email"
                  hint="Ctrl + Enter to run the gsuite script"
                  @input="changeAccountEmail"
                  @keyup.ctrl.13="keyDownOnImport"
                />
              </v-col>
              <v-col cols='12' md="4">
                <v-file-input
                  accept=".json"
                  placeholder="Import GSuite private key file (.json file)"
                  prepend-icon="mdi-database-import"
                  label="Private key"
                  ref="myfile" 
                  v-model="file"
                  :loading="loading"
                ></v-file-input>
              </v-col>
              <v-col cols='12' md="4">
                <v-textarea
                  v-model="company_id"
                  :rules="[rules.required]"
                  prepend-icon="mdi-application"
                  :loading="loading"
                  label="Company Name"
                  auto-grow
                  rows="1"
                  hide-details="auto"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                class="mb-5"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn :loading="loading" :disabled="loading" class="mr-2" @click="readAllGSuite('gsuite_users')" color="main">Users<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
              <v-btn :loading="loading" :disabled="loading" class="mr-2" @click="readAllGSuite('google_groups')" color="main">Groups<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
              <v-btn :loading="loading" :disabled="loading" class="mr-2" @click="readAllGSuite('gsuite_devices')" color="main">Devices<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
              <v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
            </v-card-title>
            <v-data-table
              v-model="selectedItems"
                :loading="loading"
                :headers="gsuiteHeaders"
                :items="items"
                :items-per-page="page"
                item-key="id"
                :search="search"
                show-select
                @update:items-per-page="getPageNum"
              > 
                <template v-slot:item.users="{ item }">
                  <span v-html="beautifyEmails(item.users)"></span>
                </template>
                <template v-slot:item.email="{ item }">
                  <span v-html="beautifyEmails(item.email)"></span>
                </template>
            </v-data-table>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
    </v-card>

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
  </v-container>
</template>

<script>
  import { BASE_API, Get, Post } from '@/api'
  import { downloadCSV, beautifyEmail, beautifyEmails } from '@/util'
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'GsuiteBoard',

    data () {
      return {
        done: false,
        loading: false,
        emails: '',
        file: null,
        company_id: '',
        search: '',
        searchCron: '',
        snackbar: false,
        message: '',
        color: 'success',
        importUrl: `admin/gsuite/drive/run`,
        gsuites: [
          {
            key: 'google_drive_shared',
            bgColor: 'success',
            title: 'Google Drive(Shared)'
          },
          {
            key: 'gsuite_users',
            bgColor: 'orange accent-3',
            title: 'GSuite'
          },
        ],
        errorMessages: {
          emails: {
            required: false,
            invalid: false,
          },
        },
        driveHeaders: [ 
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'Status',
            value: 'status'
          },
          {
            text: 'Folder Id',
            value: 'folder_id'
          },
          {
            text: 'Folder Name',
            value: 'folder_name'
          },
          {
            text: 'File Id',
            value: 'file_id'
          },
          {
            text: 'File Name',
            value: 'file_name'
          },
          {
            text: 'Users',
            value: 'users'
          },
          {
            text: 'Company',
            value: 'company_id'
          },
          {
            text: 'Run At',
            value: 'run_at'
          },
        ],
        usersHeaders: [
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'Username',
            value: 'firstname_lastname'
          },
          {
            text: 'Org Unit Path',
            value: 'org_unit_path'
          },
          {
            text: 'Recovery Email',
            value: 'recovery_email'
          },
          {
            text: 'Suspended',
            value: 'suspended'
          },
          {
            text: 'Company',
            value: 'company_id'
          },
          {
            text: 'Run At',
            value: 'run_at'
          },
        ],
        groupHeaders: [
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
            value: 'company_id'
          },
          {
            text: 'Run At',
            value: 'run_at'
          },
        ],
        deviceHeaders: [
          {
            text: 'Name',
            value: 'name',
          },
          {
            text: 'Email',
            value: 'email',
          },
          {
            text: 'Model',
            value: 'model',
          },
          {
            text: 'OS',
            value: 'os',
          },
          {
            text: 'Type',
            value: 'type',
          },
          {
            text: 'Company',
            value: 'company_id'
          },
          {
            text: 'Run At',
            value: 'run_at'
          },
        ],
        gsuiteHeaders: [],
        selectedItems: [],
        items: [],
        cronType: 'GSuite Drive',
        cronInterval: 'Weekly',
        rules: {
          required: value => {
            this.errorMessages.emails.required = !!value
            return this.errorMessages.emails.required || 'This field is required.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            this.errorMessages.emails.invalid = pattern.test(value)
            return this.errorMessages.emails.invalid || 'Invalid e-mail.'
          },
        }
      }
    },

    computed: {
      ...mapState(['userId', 'page']),

      importable () {
        return !this.loading && this.file && this.emails && !this.errorMessages.emails.invalid && this.company_id
      }
    },

    methods: {
      ...mapActions(['showConfirm', 'showCronDialog']),

      beautifyEmail,
      beautifyEmails,

      changeAccountEmail() {
        if (this.emails.includes('@')) {
          this.company_id = this.emails.split('@')[1]
        }
      },

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      changeTab (href) {
        // initialize the vars
        this.emails = ''
        if (href == 'gsuite_users') {
          this.importUrl = `admin/gsuite/users/run`
          this.gsuiteHeaders = this.usersHeaders
        } else {
          this.importUrl = `admin/gsuite/drive/run`
        }
      },

      keyDownOnImport () {
        if (this.query) {
          this.importKey()
        }
      },

      async readAll (url) {
        this.loading = true
        this.selectedItems = []
        this.items = []
        try {
          const res = await Get(url)
          this.items = res.items
          this.message = res.message
          this.color = res.status
        } catch(e) {
          this.message = 'Something wrong happened on the server.'
        } finally {
          this.loading = false
          this.snackbar = true
        }
      },

      async readAllShared () {
        this.readAll(`admin/google_drive/read`)
      },

      async readAllGSuite (type="gsuite_users") {
        this.readAll(`admin/${type}/read`)
        if (type == "gsuite_users") {
          this.gsuiteHeaders = this.usersHeaders
        } else if (type == 'google_groups') {
          this.gsuiteHeaders = this.groupHeaders
        } else if (type == 'gsuite_devices') {
          this.gsuiteHeaders = this.deviceHeaders
        }
      },

      downloadCSV () {
        if (this.selectedItems.length) {
          downloadCSV(this.selectedItems)
        } else {
          downloadCSV(this.items)
        }
      },

      async sendAttachment () {
        let _items;
        if (this.selectedItems.length) {
          _items = this.selectedItems
        } else {
          _items = this.items
        }
        this.loading = true
        try {
          const res = await Post(`admin/gsuite/drive/send`, {_items })
          this.message = res.message
          this.color = res.status
        } catch(e) {
          this.color = 'error'
          this.message = 'Something wrong happened on the server.'
        } finally {
          this.loading = false
          this.snackbar = true
        }
      },

      async importKey () {
        if (!this.emails || !this.file) {
          return
        }

        let formData = new FormData()
        formData.append("file", this.file, this.file.name);

        const data = {
          emails: this.emails,
          user_id: this.userId,
          company_id: this.company_id.trim()
        }

        const json = JSON.stringify(data);
        const blob = new Blob([json], {
          type: 'application/json'
        });

        formData.append("document", blob);
        this.loading = true
        this.file = null
        try {
          const res = await Post(this.importUrl, formData)
            this.csvData = res.csv_data
            this.message = res.message
            this.color = res.status
        } catch(e) {
          this.color = 'error'
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
    }
  }
</script>