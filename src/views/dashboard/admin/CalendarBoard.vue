<template>
	<v-container
	    id="calendar-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
	    		<div>
			        <div>Calendar Board (calendar_events)</div>
			        <v-subheader>Find Google Calendar Events</v-subheader>
			    </div>
		        <v-spacer></v-spacer>
	        	<v-btn :loading="loading" :disabled="!importable"  class="" @click="importKey" color="main">Import & Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	        	<v-btn :loading="loading" :disabled="loading"  class="" @click="showCron" color="main">CronJobs<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-row>
		    	<v-col cols='12' md="3">
	              	<v-textarea
		                v-model="emails"
		                :rules="[rules.required]"
		                :loading="loading"
		                label="Event Ids"
		                hint="Ctrl + Enter to run the calenar event script"
		                rows="3"
		                outlined
		                @keyup.ctrl.13="keyDownOnImport"
		            />
		    	</v-col>
		    	<v-col md="3" cols='12'>
	              	<v-text-field
		                v-model="user_email"
		                :rules="[rules.required, rules.email]"
		                :loading="loading"
		                label="Service Email"
		                outlined
		            />
		    	</v-col>
		    	<v-col cols='12' md="3">
	    		  	<v-file-input
					    accept=".json"
					    placeholder="Import GSuite service key file (.json file)"
					    prepend-icon="mdi-database-import"
					    label="Private key"
					    ref="myfile" 
					    v-model="file"
					    :loading="loading"
					    multiple 
				  	></v-file-input>
		    	</v-col>
		    	<v-col md="3" cols='12'>
	              	<v-text-field
		                v-model="company_id"
		                :rules="[rules.required, rules.email]"
		                :loading="loading"
		                label="Company Name"
		                outlined
		            />
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
          	  	<v-btn :loading="loading" :disabled="loading" @click="readAll" color="main">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
          	  	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="sendAttachment" color="main">Send<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
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

      	<!-- Cron job dialog -->
      	<cron-dialog type="run_calendar" interval="Weekly" />
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { downloadCSV, beautifyEmail, beautifyEmails } from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'GsuiteBoard',

		components: {
			CronDialog: () => import('../component/CronDialog')
		},

		data () {
			return {
				loading: false,
				emails: '',
				user_email: '',
				company_id: 'grove.co',
				file: null,
				snackbar: false,
		      	message: '',
		      	search: '',
		      	color: 'success',
				errorMessages: {
					emails: {
			            required: false,
			            invalid: false,
			        },
				},
				headers: [	
					{
						text: 'Email',
						value: 'email'
					},
					{
						text: 'Summary',
						value: 'summary'
					},
					{
						text: 'Status',
						value: 'status'
					},
					{
						text: 'Start',
						value: 'start_datetime'
					},
					{
						text: 'End',
						value: 'end_datetime'
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
	      		selectedItems: [],
		      	items: [],
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
      		page () {
		        return Number(localStorage.getItem('page')) || 5
	     	}, 

			importable () {
				return !this.loading && this.file && this.emails && this.user_email && this.company_id
			}
		},

		methods: {
			...mapActions(['showConfirm', 'showCronDialog']),

			beautifyEmail,
			beautifyEmails,

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    showCron () {
      			this.showCronDialog()
      		},

			keyDownOnImport () {
      			if (this.query) {
      				this.importKey()
      			}
      		},

      		async readAll () {
  			 	this.loading = true
  			 	this.selectedItems = []
      			this.items = []
		    	try {
			    	const res = await axios.get(`${BASE_API}/api/admin/calendar/read`)
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

      			const data = {
      				_items
      			}

                this.loading = true
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/calendar/send`, data)
	      			this.message = res.data.message
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

			async importKey () {
				let formData = new FormData()
	        	for (let file of this.file) {
                	formData.append("file", file, file.name);
                }

                const data = {
                	user_email: this.user_email,
                	emails: this.emails,
                	user_id: JSON.parse(localStorage.getItem('user')).id,
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
			    	const res = await axios.post(`${BASE_API}/api/admin/calendar/run`, formData)
		      		this.csvData = res.data.csv_data
	      			this.message = res.data.message
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
			},
		}
	}
</script>