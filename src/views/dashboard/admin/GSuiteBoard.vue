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
	    		<div>
			        <div>GSuite Board (gsuite_drive_shared)</div>
			        <v-subheader>Find External shared links</v-subheader>
			    </div>
		        <v-spacer></v-spacer>
	        	<v-btn :loading="loading" :disabled="!importable"  class="" @click="importKey" color="success">Import & Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	        	<v-btn :loading="loading" :disabled="loading"  class="" @click="showCronDialog" color="success">CronJobs<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-row>
		    	<v-col>
	              	<v-textarea
		                v-model="emails"
		                :rules="[rules.required]"
		                :loading="loading"
		                label="Owner Emails"
		                hint="Ctrl + Enter to run the google drive script"
		                rows="3"
		                outlined
		                @keyup.ctrl.13="keyDownOnImport"
		            />
		    	</v-col>
		    	<v-col>
	    		  	<v-file-input
					    accept=".json"
					    placeholder="Import GSuite private key file (.json file)"
					    prepend-icon="mdi-database-import"
					    label="Private key"
					    ref="myfile" 
					    v-model="file"
					    :loading="loading"
					    multiple 
				  	></v-file-input>
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
          	  	<v-btn :loading="loading" :disabled="loading" @click="readAllShared" color="success">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
          	  	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="sendAttachment" color="success">Send<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
          	 	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSVForShared" color="success">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
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
      		<v-btn
		        dark
		        text
		        @click="snackbar = false"
	      	>
		        Close
	      	</v-btn>
      	</v-snackbar>

		<confirm-dialog @callback="runCallback"></confirm-dialog>

      	<!-- Cron job dialog -->
      	<v-dialog
			v-model="cronDialog"
      	>
      		<v-card
      		>
      			<div class="d-flex flex-row align-center justify-center pa-4 ">
      				<div class="display-1 ml-4">Cron Jobs (Weekly basis)</div>
      				<v-spacer></v-spacer>
      				<v-text-field
			          v-model="searchCron"
			          append-icon="mdi-magnify"
			          label="Search"
			          class="mb-3 mr-3"
			          single-line
			          hide-details
			        ></v-text-field>
	  				<v-btn :loading="loading" :disabled="loading" @click="readAllCrons" icon><v-icon color="success" size="24">mdi-refresh</v-icon></v-btn>
	  				<v-btn :loading="loading" @click="resumeCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="success" size="24">mdi-play</v-icon></v-btn>
	  				<v-btn :loading="loading" @click="pauseCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="success" size="24">mdi-pause</v-icon></v-btn>
	  				<v-btn :loading="loading" @click="deleteCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="primary" size="24">mdi-delete</v-icon></v-btn>
	  				<v-btn class="ml-3" @click="cronDialog = false" icon><v-icon>mdi-close</v-icon></v-btn>
	  			</div>
	  			<v-card-text>
		      		<v-data-table
			    		v-model="selectedCrons"
				        :loading="loading"
				        :headers="cronHeaders"
				        :items="crons"
				        :items-per-page="page"
				        item-key="id"
				        :search="searchCron"
				        show-select
				        @update:items-per-page="getPageNum"
			      	> 
				      	<template v-slot:item.data="{ item }">
		                  	<span v-html="beautifyEmails(item.data.emails)"></span>
		                </template>
		                <template v-slot:item.run_at="{ item }">
		                  	<span v-html="beautifyDate(item.run_at)"></span>
		                </template>
		                <template v-slot:item.nextRun="{ item }">
		                  	<span v-html="showNextRun(item)"></span>
		                </template>
				  	</v-data-table>
			  	</v-card-text>
		  	</v-card>
      	</v-dialog>
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { downloadCSV, beautifyEmail, beautifyEmails, beautifyDate } from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'GsuiteBoard',

		components: {
			ConfirmDialog: () => import('../component/Confirm')
		},

		data () {
			return {
				done: false,
				cronDialog: false,
				callback: null,
				loading: false,
				emails: '',
				file: null,
				snackbar: false,
		      	message: '',
		      	search: '',
		      	searchCron: '',
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
						text: 'users',
						value: 'users'
					},
					{
						text: 'Run At',
						value: 'run_at'
					},
		      	],
	      		selectedItems: [],
		      	items: [],
		      	selectedCrons: [],
		      	crons: [],
		      	cronHeaders: [
		      		{
		      			text: 'Emails',
		      			value: 'data'
		      		},
		      		{
		      			text: 'Status',
		      			value: 'status'
		      		},
		      		{
		      			text: 'Run At',
		      			value: 'run_at'
		      		},
		      		{
		      			text: 'Next Run',
		      			value: 'nextRun'
		      		},
		      	],
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
				return !this.loading && this.file && this.emails && !this.errorMessages.emails.invalid
			}
		},

		methods: {
			...mapActions(['showConfirm']),

			beautifyEmail,
			beautifyEmails,
			beautifyDate,

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

			keyDownOnImport () {
      			if (this.query) {
      				this.importKey()
      			}
      		},

      		async readAllShared () {
  			 	this.loading = true
  			 	this.selectedItems = []
      			this.items = []
		    	try {
			    	const res = await axios.get(`${BASE_API}/api/admin/gsuite/read`)
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

      		downloadCSVForShared () {
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
			    	const res = await axios.post(`${BASE_API}/api/admin/gsuite/send`, data)
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
				if (!this.emails || !this.file) {
					return
				}

				let formData = new FormData()
	        	for (let file of this.file) {
                	formData.append("file", file, file.name);
                }

                const data = {
                	'emails': this.emails,
                	'user_id': JSON.parse(localStorage.getItem('user')).id
                }

                const json = JSON.stringify(data);
				const blob = new Blob([json], {
				  type: 'application/json'
				});

				formData.append("document", blob);

                this.loading = true
                this.file = null
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/gsuite/run`, formData)
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

			// Cron jobs
			showCronDialog () {
      			this.cronDialog = true
      			this.readAllCrons()
      		},

      		async readAllCrons () {
  			 	this.loading = true
  			 	this.selectedCrons = []
      			this.crons = []
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/cron/read`, { type: 'GSuite Drive'})
		      		this.crons = res.data.crons
	      			this.message = res.data.message
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		pauseCrons () {
      			this.callback = this._pauseCrons
      			this.showConfirm()
      		},

      		async _pauseCrons () {
  			 	const ids = this.selectedCrons.map(cron => cron.job_id)
  			 	this.loading = true
  			 	let data = { 
  			 		ids,
  			 		type: 'GSuite Drive' 
  			 	}
  			 	console.log(data)
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/cron/pause`, data)
			    	this.selectedCrons = []
			    	this.crons.map(cron => {
			    		if (data.ids.includes(cron.job_id)) {
			    			cron.status = 'paused'
			    		}
			    	})
	      			this.message = res.data.message
	      			this.color = res.data.status

		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		resumeCrons () {
      			this.callback = this._resumeCrons
      			this.showConfirm()
      		},

      		async _resumeCrons () {
  			 	this.loading = true
  			 	const ids = this.selectedCrons.map(cron => cron.job_id)
  			 	let data = { 
  			 		ids,
  			 		type: 'GSuite Drive' 
  			 	}
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/cron/resume`, data)
			    	this.selectedCrons = []
			    	this.crons.map(cron => {
			    		if (data.ids.includes(cron.job_id)) {
			    			cron.status = 'active'
			    		}
			    	})
			    	console.log(this.crons)
	      			this.message = res.data.message
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		deleteCrons () {
      			this.callback = this._deleteCrons
      			this.showConfirm()
      		},

      		async _deleteCrons () {
  			 	this.loading = true
  			 	const ids = this.selectedCrons.map(cron => cron.job_id)
  			 	let data = { 
  			 		ids,
  			 		type: 'GSuite Drive' 
  			 	}
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/cron/delete`, data)
			    	this.crons = this.crons.filter(cron => !data.ids.includes(cron.job_id))
			    	this.selectedCrons = []
	      			this.message = res.data.message
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		showNextRun (item) {
      			let nextRun = '-'
      			if (item.status == 'done' || item.status == 'active') {
      				nextRun = this.$moment().add(1, 'weeks').startOf('week').format('DD MMM YYYY')
      			}

      			return nextRun
      		},

      		runCallback () {
      			if (this.callback) {
      				this.callback()
      			}
      		}
		}
	}
</script>