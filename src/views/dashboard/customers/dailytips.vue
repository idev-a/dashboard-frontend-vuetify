<template>
	<v-container
    id="company-users"
    fluid
    tag="section"
  >
    <v-card
      title="Users"
      class="px-5 py-3"
    >
      <v-card-title>
        DAILY TIPS
      </v-card-title>

      <v-row>
      	<v-col
			cols="12"
			md="6"
      	>
			<div class="subtitle-1 mt-3">TODAY TIP ({{ today }})</div>
			<v-divider ></v-divider>
			<v-sheet class="pa-5 my-6 min-300" elevation="1">
				<div class="mb-4 text-uppercase display-1 font-weight-bold">{{todayTip.title_text}}</div>
				<p>{{todayTip.full_text}} </p>
			</v-sheet>
			<v-btn color="success">Send Now</v-btn>
  		</v-col>

  		<v-col
			cols="12"
			md="6"
      	>
			<div class="subtitle-1 mt-3">UPCOMING TIP ({{ upcoming }})</div>
			<v-divider ></v-divider>
			<v-sheet class="pa-5 my-6 min-300" elevation="1">
				<div class="mb-4 text-uppercase display-1 font-weight-bold">{{upcomingTip.title_text}}</div>
				<p>{{upcomingTip.full_text}} </p>
			</v-sheet>
  		</v-col>
  	</v-row>

  	<v-row>
      	<v-col
			cols="12"
      	>
			<div class="subtitle-1 mt-3">AVAILABLE USERS</div>
			<v-divider ></v-divider>
			<v-data-table
			v-if="users.length > 0"
	        :loading="loading"
	        :headers="userHeaders"
	        :items="users"
	        :search="userSearch"
	        item-key="id"
	        :items-per-page="page"
	        @update:items-per-page="getPageNum"
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
		            <v-dialog v-model="dialog" max-width="500px">
		              <template v-slot:activator="{ on }">
		                <v-btn color="success" dark class="mb-2" v-on="on">Add New Tip</v-btn>
		              </template>
		              <v-card>
		                <v-card-title>
		                  <span class="headline">{{ formTitle }}</span>
		                </v-card-title>
		                <v-card-text>
		                  <v-container>
		                    <v-row>
		                      	<v-col cols="12" md="6">
			                        <v-text-field 
			                        	v-model="editedItem.title_text"
			                        	label="Title" 
			                        	:rules="[rules.required]"
			                        	hide-details="auto"
			                        	>
		                        	</v-text-field>
		                      	</v-col>
		                      	<v-col cols="12" md="6">
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
								        <v-date-picker v-model="editedItem.date" @input="dateMenu = false"></v-date-picker>
								      </v-menu>
		                      	</v-col>
		                    </v-row>
		                    <v-row>
		                    	<v-col cols="12">
							        <v-textarea
							          v-model="editItem.full_text"	
							          outlined
							          :rules="[rules.required]"
							          name="Text"
							          label="Text"
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
		</v-data-table>
    	
	</v-card>
</v-container>
</template>

<script>
	import { BASE_API } from '../../../api'
	import axios from 'axios'

 	export default {
	    name: 'DashboardAdminDailyTips',

	    data: () => ({
	      loading: false,
	      dateMenu: false,
	      tipSearch: '',
	      userSearch: '',
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
          tipHeaders: [
	        {
	          text: 'Month',
	          value: 'month',
	          width: '100',
	        },
	        {
	          text: 'Day',
	          value: 'day',
	          width: '90',
	        },
	        {
	          text: 'Title',
	          value: 'title_text',
	        },
	        {
	          text: 'Text',
	          value: 'full_text',
	        },
          ],
          users: [],
          tips: [],
	      todayTip: {
	      	title_text: '',
	      	full_text: ''
	      },
	      upcomingTip: {
	      	title_text: '',
	      	full_text: ''
	      },
	      today: '',
	      upcoming: '',
	      dialog: false,
	      editedIndex: -1,
	      editedItem: {
	        date: new Date().toISOString().substr(0, 10),
	        title_text: '',
	        full_text: '',
	      },
	      defaultItem: {
	        date: new Date().toISOString().substr(0, 10),
         	title_text: '',
	        full_text: '',
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
	    	formTitle () {
		        return this.editedIndex === -1 ? 'New Tip' : 'Edit Tip'
	      	},

	    	page () {
		        return Number(localStorage.getItem('page')) || 5
	      	}, 
	    },

	  	mounted () {
	  		this.fetchDailyTips()

	  		this.today = this.$moment().format('MMMM DD, YYYY')
	  		this.upcoming = this.$moment().add(1,'days').format('MMMM DD, YYYY')
	  	},

	  	methods: {
	  		save (item) {
		        this.updateTip(item)
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
				  this.updateTip(this.editedItem)
				} else {
				  this.users.push(this.editedItem)
				  this.createTip(this.editedItem)
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
				  this.deleteTip(item)
				} 
			},

	  		getPageNum (_page) {
		        localStorage.setItem('page', _page)
	      	},

	      	updateTip (item) {

	      	},

	      	deleteTip (item) {

	      	},

	      	createTip (item) {

	      	},

	  		async fetchDailyTips () {
		        this.loading = true
		        const data = await axios.get(`${BASE_API}/api/tips/daily`).catch(err => console.log(err));
		        if (data) {
		        	this.users = data.data.users
		        	this.tips = data.data.tips
		        	this.todayTip = data.data.today_tip
		        	this.upcomingTip = data.data.upcoming_tip
		        }
		        this.loading = false
	      	},
	  	}
	}
</script>

<style>
	.min-300 {
		min-height: 200px;
	}
</style>