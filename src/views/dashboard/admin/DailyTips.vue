<template>
  <v-container
    id="daily-tip"
    fluid
    tag="section"
  >
    <v-card
      class="pa-5"
      :loading="loading"
    >
      <div class="d-flex align-center justify-space-between mb-5" >
        <div class="display-2">DAILY TIPS</div> 

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn :loading="cronLoading" v-on="on" :disabled="cronLoading" @click="manageCron()" :class="cronBtnClass">{{cronBtnTitle}}</v-btn>
          </template>
          <span>{{cronBtnTooltip}}</span>
        </v-tooltip>
      </div>

      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <div class="subtitle-1 mt-3 border-line">TODAY TIP ({{ today }})</div>
          <v-sheet :loading="loading" class="pa-5 my-6 min-200" elevation="1">
            <div class="mb-4 text-uppercase display-1 font-weight-bold">{{todayTip.title_text}}</div>
            <p>{{todayTip.full_text}} </p>
          </v-sheet>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn :loading="sendLoading" v-on="on" :disabled="sendLoading || !todayTip.title_text" color="main" @click="showAlert(todayTip.id)">Send Now<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
            </template>
            <span>Send Daily Tip Now</span>
          </v-tooltip>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div class="subtitle-1 mt-3 border-line">TODAY DELIVERED USERS</div>
          <v-data-table
            v-if="deliveredUsers.length > 0"
            :loading="loading"
            :headers="deliveredUsersHeaders"
            :items="deliveredUsers"
            :search="deliveredUserSearch"
            item-key="id"
            :items-per-page="page"
            @update:items-per-page="getPageNum"
            class="max-400"
          >
            <template v-slot:top>
              <v-text-field
                v-model="deliveredUserSearch"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                class="mx-3"
              ></v-text-field>
            </template>
            <template v-slot:item.emails="{ item }">
              <div class="d-flex flex-wrap" v-html="beautifyEmails(item.emails)"></div>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip class="text-uppercase" :class="item.status == 'delivered'? 'success' : 'danger'">{{item.status}}</v-chip>
            </template>
            <template v-slot:item.run_at="{ item }">
              <div>{{formatTime(item.run_at)}}</div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

    <v-row class="mt-6">
      <v-col
        cols="12"
        md="6"
      >
        <div class="subtitle-1 mt-3 border-line">UPCOMING TIP ({{ upcoming }})</div>
        <v-sheet :loading="loading" class="pa-5 my-6 min-200" elevation="1">
          <div class="mb-4 text-uppercase display-1 font-weight-bold">{{upcomingTip.title_text}}</div>
          <p>{{upcomingTip.full_text}} </p>
        </v-sheet>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <div class="subtitle-1 mt-3 border-line">AVAILABLE USERS</div>
        <v-data-table
          :loading="loading"
          :headers="userHeaders"
          :items="users"
          :search="userSearch"
          item-key="id"
          :items-per-page="page"
          @update:items-per-page="getPageNum"
          class="max-400"
        >
          <template v-slot:top>
            <v-text-field
              v-model="userSearch"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              class="mx-3"
            ></v-text-field>
          </template>
          <template v-slot:item.email="{ item }">
            <span v-html="beautifyEmails(item.email)"></span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>

  <v-card
    title="Users"
    class="px-5 py-3"
  >
    <v-card-title>
      ALL TIPS
    </v-card-title>
    <v-data-table
      v-if="tips.length > 0"
      :loading="loading"
      :headers="tipHeaders"
      :items="tips"
      :search="tipSearch"
      item-key="id"
      :items-per-page="page"
      @update:items-per-page="getPageNum"
      @click:row="editItem"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-text-field
              v-model="tipSearch"
              append-icon="mdi-magnify"
              label="Search"
              single-line
            ></v-text-field>
          </v-toolbar-title>
        
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="720px">
            <template v-slot:activator="{ on }">
              <v-btn color="main" dark class="mb-2" v-on="on"><v-icon size="16" left dark>mdi-plus</v-icon>Add New Tip</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.title_text"
                        label="Title" 
                        auto-grow
                        rows="1"
                        :rules="[rules.required]"
                        hide-details="auto"
                        >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="editedItem.date"
                            label="Date"
                            readonly
                            :rules="[rules.required]"
                            v-on="on"
                          >
                            <v-icon slot="prepend" color="red">mdi-calendar</v-icon>
                          </v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.date"  @input="dateMenu = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.full_text"  
                        outlined
                        auto-grow
                        rows="3"
                        :rules="[rules.required]"
                        label="Full Text"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.img_url"  
                        outlined
                        auto-grow
                        rows="1"
                        :rules="[rules.required]"
                        label="Image url"
                      ></v-textarea>
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
          <span>Edit Tip</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="modal" max-width="290">
    <v-card>
      <v-card-title class="text-center"><b>WARNING</b></v-card-title>
      <v-card-text>Are you sure?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="modal = false">Disagree</v-btn>
        <v-btn color="green darken-1" text @click="sendTip()">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
import { BASE_API, Get, Post } from '@/api'
import { validEmail, beautifyEmails } from '@/util'
import { mapState } from 'vuex'

export default {
  name: 'DashboardAdminDailyTips',

  data: () => ({
    loading: true,
    sendLoading: false,
    cronLoading: false,
    modal: false,
    dateMenu: false,
    tipSearch: '',
    userSearch: '',
    deliveredUserSearch: '',
    userHeaders: [
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
      ],
      deliveredUsersHeaders: [
      {
        text: 'Emails',
        value: 'emails',
        width: '350',
      },
      {
        text: 'Status',
        value: 'status',
      },
      {
        text: 'Time',
        value: 'run_at'
      },
      ],
      tipHeaders: [
      {
         text: 'Date',
         value: 'date',
         width: '70',
      },
      {
        text: 'Title',
        value: 'title_text',
      },
      {
        text: 'Text',
        value: 'full_text',
      },
      { text: 'Actions', value: 'action', sortable: false },
    ],
    users: [],
    deliveredUsers: [],
    tips: [],
    cronStatus: 'active',
    todayTip: {
      id: '',
      title_text: '',
      full_text: ''
    },
    upcomingTip: {
      id: '',
      title_text: '',
      full_text: ''
    },
    today: '',
    tip_id: '',
    upcoming: '',
    dialog: false,
    editedIndex: -1,
    defaultItem: {
      date: new Date().toISOString().substr(0, 10),
      title_text: '',
      full_text: '',
      img_url: '',
    },
    editedItem: {
      date: new Date().toISOString().substr(0, 10),
      title_text: '',
      full_text: '',
      img_url: '',
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

  computed: {
    ...mapState(['page']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Tip' : 'Edit Tip'
    },
    cronBtnTitle () {
      return this.cronStatus == 'active' ? 'Pause' : 'Resume'
    },
    cronBtnClass () {
      return this.cronStatus == 'active' ? 'red darken-2 float-right' : 'main float-right' 
    },
    cronBtnTooltip () {
      return this.cronStatus == 'active' ? 'Pause Daily Tips Cron' : 'Resume Daily Tips Cron' 
    }
  },

  mounted () {
    this.fetchDailyTips()
    this.today = this.$moment().format('MMMM DD, YYYY')
    this.upcoming = this.$moment().add(1,'days').format('MMMM DD, YYYY')
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  methods: {
    beautifyEmails,

    formatDate (item) {
      const thisYear = this.$moment().format('YYYY')
      return this.$moment(`${thisYear} ${item.month} ${item.day}`).format('MM-DD')
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async create () {
      this.close()
      let item = Object.assign({}, this.editedItem)
      let _item = Object.assign({}, this.editedItem)
      item.date = this.$moment(item.date).format('MMMM-DD')
      _item.date = this.$moment(item.date).format('MM-DD')
      if (this.editedIndex > -1) {
        Object.assign(this.tips[this.editedIndex], _item)
        this.updateTip(item)
      } else {
        this.tips.push(_item)
        this.createTip(item)
      }
    },

    editItem (item) {
      this.editedIndex = this.tips.indexOf(item)
      this.editedItem = Object.assign({}, item)
      const thisYear = this.$moment().format('YYYY')
      this.editedItem.date = this.$moment(`${thisYear} ${item.date}`).format('YYYY-MM-DD')
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.tips.indexOf(item)
      const res = confirm('Are you sure you want to delete this item?')
      if (res == true) {
        this.tips.splice(index, 1)
        this.deleteTip(item)
      } 
    },

    getPageNum (_page) {
      localStorage.setItem('page', _page)
    },

    async updateTip (item) {
      this.loading = true
      const data = await Post(`tips/daily/update`, item)
      this.loading = false
      this.dialog = false
    },

    async deleteTip (item) {
      this.loading = true
      const data = await Post(`tips/daily/delete`, item)
      this.loading = false
      this.dialog = false
    },

    async createTip (item) {
      this.loading = true
      const res = await Post(`tips/daily/create`, item)
      this.loading = false
      this.dialog = false
    },

    showAlert (tip_id) {
      this.tip_id = tip_id
      this.modal = true
    },

    async sendTip () {
      this.modal = false
      this.sendLoading = true
      const res = await Post(`tips/daily/${this.tip_id}/send`)
      this.deliveredUsers = res.users
      this.sendLoading = false
    },

    async fetchDailyTips () {
      this.loading = true
      const self = this
      const res = await Get(`tips/daily`)
      if (res) {
        this.users = res.users
        this.deliveredUsers = res.delivered_users
        const thisYear = this.$moment().format('YYYY')
        res.tips.map(tip => {
          tip.date = self.$moment(`${thisYear} ${tip.month} ${tip.day}`).format('MM-DD')
          return tip
        })
        this.tips = res.tips
        this.todayTip = res.today_tip
        this.upcomingTip = res.upcoming_tip
      }
      this.loading = false
    },

    formatTime (date) {
      return this.$moment(date).format('HH:mm:ss')
    },

    async manageCron () {
      this.cronLoading = true
      const res = await Post(`tips/daily/cron/${this.cronStatus}`)
      this.cronLoading = false
      this.cronStatus = res.res
    }
  }
}
</script>

<style>
.min-200 {
  min-height: 200px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}

.max-400 {
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}

.border-line {
  border-bottom: 1px solid #0e0e0e;
  display: inline;
  padding-bottom: .25rem;
}
</style>
