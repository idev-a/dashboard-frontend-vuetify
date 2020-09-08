<template>
  <div>
    <confirm-dialog @callback="runCallback"></confirm-dialog>

    <v-dialog
      :value="cron.dialog"
      @click:outside="hideDialog"
      >
        <v-card
        >
          <div class="d-flex flex-wrap flex-row align-center justify-center pa-4 ">
            <div class="display-1 ml-4">Cron Jobs ({{ _name(cron.type) }} - {{ cron.interval }})</div>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="searchCron"
              append-icon="mdi-magnify"
              label="Search"
              class="mb-3 mr-3"
              single-line
              hide-details
            ></v-text-field>
            <div>
            <v-btn :loading="loading" :disabled="loading" @click="readAllCrons" icon><v-icon color="success" size="24">mdi-refresh</v-icon></v-btn>
            <v-btn :loading="loading" @click="resumeCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="success" size="24">mdi-play</v-icon></v-btn>
            <v-btn :loading="loading" @click="pauseCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="success" size="24">mdi-pause</v-icon></v-btn>
            <v-btn :loading="loading" @click="deleteCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="primary" size="24">mdi-delete</v-icon></v-btn>
          </div>
          <v-btn class="ml-3" @click="hideDialog" icon><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <v-card-text>
          <v-data-table
            v-model="selectedCrons"
            :loading="loading"
            :headers="cronHeaders"
            :items="crons"
            :items-per-page="page"
            item-key="job_id"
            :search="searchCron"
            show-select
            @update:items-per-page="getPageNum"
          > 
            <template v-slot:item.name="{ item }">
                <span v-if="item.name">{{_name(item.name)}}</span>
            </template>
            <template v-slot:item.emails="{ item }">
                <span v-html="beautifyEmails(item.emails)"></span>
            </template>
            <template v-slot:item.recipients="{ item }">
                <span v-if="item.recipients" v-html="beautifyEmails(item.recipients)"></span>
            </template>
            <template v-slot:item.attachments="{ item }">
                <span v-if="item.attachments">{{ item.attachments.length + 1 }} attachments</span>
            </template>
            <template v-slot:item.run_at="{ item }">
                <span v-html="beautifyDateTime(item.run_at)"></span>
            </template>
            <template v-slot:item.nextRun="{ item }">
                <span v-html="showNextRun(item.nextRun)"></span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>  
</template>

<script>
import { BASE_API, Get, Post } from '@/api'
import { mapState, mapActions } from 'vuex';
import { downloadCSV, beautifyEmail, beautifyEmails, beautifyDateTime } from '@/util'
export default {
  name: 'CronDialog',

  components: {
    ConfirmDialog: () => import('../component/Confirm')
  },

  computed: {
    ...mapState(['cron', 'page']),
  },

  watch: {
    cron: {
      deep: true,

      handler () {
        this.modifyHeaders()
      }
    }
  },

  data () {
    return {
      loading: false,
      searchCron: '',
      callback: null,
      selectedCrons: [],
      crons: [],
      cronHeaders: [],
      cronHeadersDefault: [
        {
          text: 'Emails',
          value: 'emails'
        },
        {
          text: 'Company',
          value: 'company_id'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Trigger',
          value: 'interval'
        },
        {
          text: 'Next Run',
          value: 'nextRun'
        },
      ],
    }
  },

  mounted () {
    this.modifyHeaders()
  },

  methods: {
    ...mapActions(['showConfirm', 'showCronDialog']),

    beautifyEmails,
    beautifyDateTime,

    modifyHeaders () {
      if (this.cron.type == 'All') {
        this.cronHeaders = [
          {
            text: 'Name',
            value: 'name',
            width: 150
          },
          ...this.cronHeadersDefault
        ]
      } else {
        this.cronHeaders = JSON.parse(JSON.stringify(this.cronHeadersDefault))
      }

      // Email notification
      if (this.cron.type == 'run_email_notification') {
        this.cronHeaders = this.cronHeadersDefault.slice(2, 5)
        this.cronHeaders = [
          {
            text: 'Query',
            value: 'query',
            width: 250
          },
          {
            text: 'Title',
            value: 'title',
            width: 200
          },
          {
            text: 'Message',
            value: 'message',
            width: 400
          },
          {
            text: 'Recipients',
            value: 'recipients'
          },
          {
            text: 'Attachments',
            value: 'attachments'
          },
          ...this.cronHeaders
        ]
      }

      this.crons = this.selectedCrons = []
      this.readAllCrons()
    },

    _name(val) {
      const readableNames = {
        All: 'All',
        run_daily_tip: 'Daily Tips',
        run_calendar: 'Google Calendar Events',
        run_gsuite_users: 'GSuite Users',
        run_gsuite_devices: 'GSuite Mobiles',
        run_google_groups: 'Google Groups',
        run_slack: 'Slack Users',
        run_zoom: 'Zoom Users',
        run_bamboo: 'General Bamboo',
        run_o365: 'Office 365 Users',
        run_dropbox: 'Dropbox Users',
        run_atlassian: 'Atlassian Users',
        run_g_drive_share: 'Google Drive Shared Folders',
        run_email_notification: 'Email Notification',
        run_migrate_users: 'Migrate Users',
        run_migrate_groups: 'Migrate Groups',
      }
      return readableNames[val]
    },

    getPageNum (_page) {
      localStorage.setItem('page', _page)
    },

    async readAllCrons () {
      this.loading = true
      this.selectedCrons = []
      this.crons = []
      try {
        const res = await Post(`admin/cron/read`, { type: this.cron.type})
        this.crons = res.crons
        this.message = res.message
        this.color = res.status
      } catch(e) {
        this.message = 'Something wrong happened on the server.'
      } finally {
        this.loading = false
        this.snackbar = true
      }
    },

    async pauseCrons () {
      const self = this
      await this.$dialog.confirm({
        text: 'Do you really want to pause crons?',
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              self._pauseCrons()
            }
          }
        }
      })
    },

    async _pauseCrons () {
      const ids = this.selectedCrons.map(cron => cron.job_id)
      this.loading = true
      let data = { 
        ids,
        type: this.cron.type 
      }
      try {
        const res = await Post(`admin/cron/pause`, data)
        this.selectedCrons = []
        if (res.status == 'success') {
          this.crons.map(cron => {
            if (data.ids.includes(cron.job_id)) {
              cron.status = 'Paused'
              cron.nextRun = '-'
            }
          })
        }
        this.message = res.message
        this.color = res.status

      } catch(e) {
        this.message = 'Something wrong happened on the server.'
      } finally {
        this.loading = false
        this.snackbar = true
      }
    },

    async resumeCrons () {
      const self = this
      await this.$dialog.confirm({
        text: 'Do you really want to resume crons?',
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              self._resumeCrons()
            }
          }
        }
      })
    },

    async _resumeCrons () {
      this.loading = true
      const ids = this.selectedCrons.map(cron => cron.job_id)
      let data = { 
        ids,
        type: this.cron.type
      }
      try {
        const res = await Post(`admin/cron/resume`, data)
        this.selectedCrons = []
        this.crons.map(cron => {
          if (data.ids.includes(cron.job_id)) {
            cron.status = 'Active'
          }
        })
        this.message = res.message
        this.color = res.status
      } catch(e) {
        this.message = 'Something wrong happened on the server.'
      } finally {
        this.loading = false
        this.snackbar = true
      }
    },

    async deleteCrons () {
      const self = this
      await this.$dialog.confirm({
        text: 'Do you really want to delete crons?',
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              self._deleteCrons()
            }
          }
        }
      })
    },

    async _deleteCrons () {
      this.loading = true
      const ids = this.selectedCrons.map(cron => cron.job_id)
      let data = { 
        ids,
        type: this.cron.type
      }
      try {
        const res = await Post(`admin/cron/delete`, data)
        this.crons = this.crons.filter(cron => !data.ids.includes(cron.job_id))
        this.selectedCrons = []
        this.message = res.message
        this.color = res.status
      } catch(e) {
        this.message = 'Something wrong happened on the server.'
      } finally {
        this.loading = false
        this.snackbar = true
      }
    },

    showNextRun (item) {
      let nextRun = '-'
      if (item) {
        nextRun = item
      }

      return nextRun
    },

    hideDialog () {
      this.showCronDialog({ dialog: false })
    },

    runCallback () {
      if (this.callback) {
        this.callback()
      }
    }
  }
}
</script>