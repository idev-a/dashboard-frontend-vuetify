<!-- create an jwt app https://marketplace.zoom.us/develop/create -->
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
            Zoom Board (zoom_users)
            <v-spacer></v-spacer>
            <v-btn class="main" @click="authZoom" :loading="loading" :disabled="!importable">
            Authenticate
            <v-icon right>mdi-send</v-icon>
          </v-btn>
          <v-btn :loading="loading"  :disabled="loading" @click="showCron" color="main">Crons<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols='12' md="4">
              <v-textarea
                v-model="apiKey"
                :rules="[rules.required]"
                prepend-icon="mdi-email"
                :loading="loading"
                label="JWT API Key"
                auto-grow
                    rows="1"
                hide-details="auto"
              ></v-textarea>
            </v-col>
            <v-col cols='12' md="4">
              <v-textarea
                v-model="apiSecret"
                :rules="[rules.required]"
                prepend-icon="mdi-email"
                :loading="loading"
                label="JWT API Secret"
                auto-grow
                    rows="1"
                hide-details="auto"
              ></v-textarea>
            </v-col>
            <v-col cols='12' md="4">
              <v-textarea
                v-model="company_id"
                :rules="[rules.required]"
                prepend-icon="mdi-email"
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
                  <v-btn :loading="loading" :disabled="loading" class="mr-2" @click="readAll" color="main">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
                <v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
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
  </v-container>
</template>

<script>
  import { BASE_API, Get, Post } from '@/api'
  import { downloadCSV, beautifyEmail, beautifyEmails } from '@/util'
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'ZoomBoard',

    data () {
      return {
        loading: false,
        apiKey: 'aJcQVBq0T7WbOe9V236zuQ',
        apiSecret: '4CZOtvU3pwlh4JjlIfmHYpiMEM9lFhmJQ1rX',
        company_id: '',
        snackbar: false,
        message: '',
        color: 'success',
        search: '',
        selectedItems: [],
        items: [],
        headers: [
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'First Name',
            value: 'first_name'
          },
          {
            text: 'Last Name',
            value: 'last_name'
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
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
        }
      }
    },

    computed: {
      ...mapState(['page', 'userId']),

      importable () {
        return !this.loading && this.apiKey.trim() && this.apiSecret.trim() && this.company_id.trim()
      },
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

      showCron () {
        this.showCronDialog({dialog: true, type: 'run_zoom', interval: 'Daily'})
      },

      async readAll () {
        var url = `admin/zoom_users/read`
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

      async authZoom () {
        this.loading = true
        try {
          const res = await Post(`admin/zoomcallback`, { 
            apiKey: this.apiKey.trim(),
            apiSecret: this.apiSecret.trim(),
            user_id: this.userId,
            company_id: this.company_id.trim()
          })
          this.message = res.message
          this.color = res.status
        } catch (e) {
          console.log(e.response)
        } finally {
          this.loading = false
          this.snackbar = true
        }
      }
    }
  }
</script>