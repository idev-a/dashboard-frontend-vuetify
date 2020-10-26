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
          Office365 Board (office_365_users, office_365_groups)
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="main" :loading="loading" v-on="on" v-bind="attrs"   @click="redirectO365" :disabled="!importable">
                <v-icon >mdi-send</v-icon>
              </v-btn>
              </template>
            <span>Authenticate O365</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :loading="loading" :disabled="loading" v-on="on" v-bind="attrs"  class="" @click="showCron" color="main"><v-icon  size="16"  dark>mdi-clock-time-eight-outline</v-icon></v-btn>
            </template>
            <span>Show Cron information</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="uploadDialog=true" color="main"><v-icon  size="16" dark>mdi-upload</v-icon></v-btn>
            </template>
            <span>Upload Extra Sheet</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="o365ClientId"
                :rules="[rules.required]"
                prepend-icon="mdi-email"
                :loading="loading"
                label="Client Id"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="o365ClientSecret"
                :rules="[rules.required]"
                prepend-icon="mdi-email"
                :loading="loading"
                label="Client Secret"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="company_id"
                :rules="[rules.required]"
                prepend-icon="mdi-email"
                :loading="loading"
                label="Company Name"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="false">
            <v-col>
              <v-select
                v-model="scope"
                chips
                atach
                multiple
                :items="scopes"
                label="Select an scope"
                hint="Select an scope to retrieve user info"
                readonly
              ></v-select>
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" class="mr-2" @click="readAllUsers" color="main">Users<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
              </template>
              <span>Show all data for office_365_users table</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" class="mr-2" @click="readAllGroups" color="main">Groups<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
              </template>
              <span>Show all data for office_365_groups table</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
              </template>
              <span>Download data below</span>
            </v-tooltip>
          </v-card-title>
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
            <template v-slot:item.users="{ item }">
              <span v-html="beautifyEmails(item.users)"></span>
            </template>
            <template v-slot:item.email="{ item }">
              <span v-html="beautifyEmail(item.email)"></span>
            </template>
          </v-data-table>
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

    <v-dialog
      v-model="uploadDialog"
      width=600
    >
      <v-card>
        <v-card-title>
          Upload extra sheet
        </v-card-title>
        <div class="text-center">
          (office_365_users)
        </div>
        <v-card-text>
          <v-form
            ref="uploadForm"
            v-model="uploadValid"
          >
            <v-row>
              <v-col cols="12" md="6">
                <v-file-input
                  ref="myfile" 
                  v-model="file"
                  accept=".csv"
                  placeholder="Import CSV file"
                  prepend-icon="mdi-database-import"
                  label="Extra sheet"
                  :rules="[rules.required]"
                  :loading="loading"
                  @change="uploadCSV"
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedFields"
                  :items="csvFields"
                  label="Select fields" 
                  hint="Select fields to be populated into office_365_users table"
                  persistent-hint
                  multiple
                  deletable-chips
                  chips
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="uploadDialog = false" :loading="loading" :disabled="loading">Close</v-btn>
              <v-btn color="success" text @click="uploadCSV2Server" :loading="loading" :disabled="loading || !uploadValid || !company_id">Upload</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { BASE_API, Get, Post } from '@/api'
  import { downloadCSV, beautifyEmail, beautifyEmails } from '@/util'
  import { mapState, mapActions } from 'vuex';
  import * as Papa from 'papaparse'

  export default {
    name: 'GsuiteBoard',

    data () {
      return {
        loading: false,
        snackbar: false,
        message: '',
        color: 'success',
        o365ClientId: '892cebc7-08ed-4cff-bf80-a6b79ea2f2c3',
        o365ClientSecret: '.pjM5.F5F247l4MctVao5GF~b_869jO9Q.',
        scope: ["User.Read.All", "Contacts.Read", "email", "Group.Read.All", "Directory.Read.All", "Group.ReadWrite.All", "Directory.ReadWrite.All", "Directory.AccessAsUser.All", "Application.Read.All"],
        scopes: ["User.Read", "User.ReadBasic.All", "Directory.Read.All", "Directory.AccessAsUser.All", "User.Read.All", "Contacts.Read", "Contacts.Read.Shared", "User.ManageIdentities.All", "email", "Policy.ReadWrite.AuthenticationMethod"],
        company_id: '',
        search: '',
        selectedItems: [],
        items: [],
        headers: [],
        userHeaders: [
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'Name',
            value: 'fullname'
          },
          {
            text: 'Type',
            value: 'type'
          },
          {
            text: 'Company',
            value: 'company_id'
          },
          {
            text: 'Run',
            value: 'run_at'
          }
        ],
        groupHeaders: [
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'DisplayName',
            value: 'displayName'
          },
          {
            text: 'Description',
            value: 'description'
          },
          {
            text: 'Company',
            value: 'company_id'
          },
          {
            text: 'Run',
            value: 'run_at'
          }
        ],
        file: null,
        selectedFields: [],
        csvFields: [],
        uploadDialog: false,
        uploadValid: true,
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        }
      }
    },

    computed: {
      ...mapState(['page', 'userId', 'companyId']),

      importable () {
        return !this.loading && this.o365ClientId.trim() && this.o365ClientSecret.trim() && this.scope.length && this.company_id.trim()
      }
    },

    methods: {
      ...mapActions(['showCronDialog']),

      beautifyEmail,
      beautifyEmails,

      downloadCSV () {
        if (this.selectedItems.length) {
          downloadCSV(this.selectedItems)
        } else {
          downloadCSV(this.items)
        }
      },
      
      getPageNum (_page) {
        localStorage.setItem('page', _page)
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

      async readAllUsers () {
        this.headers = this.userHeaders
        var url = `admin/office_365_users/read`
        await this.readAll(url)
      },

      async readAllGroups () {
        this.headers = this.groupHeaders
        var url = `admin/office_365_groups/read`
        await this.readAll(url)
      },

      async redirectO365 () {
        this.loading = true
        try {
          const res = await Post(`o365/buildurl`, { 
            O365_CLIENT_ID: this.o365ClientId.trim(),
            O365_CLIENT_SECRET: this.o365ClientSecret.trim(),
            scope: this.scope.join(','),
            company_id: this.company_id,
            user_id: this.userId
          })
          if (res.status == 'success') {
            window.open(res.auth_url, '_blank', "toolbar=yes, resizable=yes, top=100, left=100, width=400, height=300, noreferrer")
          }
        } catch (e) {
          console.log(e.response)
        } finally {
          this.loading = false
        }
      },
      showCron () {
        this.showCronDialog({dialog: true, type: 'run_o365', interval: 'Daily'})
      },
      uploadCSV () {
        const _fields = []
        const self = this
        Papa.parse(this.file, {
          worker: true,
          step: function(row) {
            _fields.push(row.data)
          },
          complete: function() {
            self.csvFields = _fields[0]
          },
          skipEmptyLines: true
        })
      },
      async uploadCSV2Server () {
        let formData = new FormData()
        formData.append("file", this.file, this.file.name);

        const data = {
          fields: this.selectedFields,
          company_id: this.company_id
        }

        const json = JSON.stringify(data);
        const blob = new Blob([json], {
          type: 'application/json'
        });

        formData.append("document", blob);
        this.loading = true
        this.file = null
        try {
          const res = await Post('o365/upload_csv', formData)
          this.message = res.message
          this.color = res.status
        } catch(e) {
          this.color = 'error'
          this.message = 'Something wrong happened on the server.'
        } finally {
          this.loading = false
          this.snackbar = true
        }
      }
    }
  }
</script>